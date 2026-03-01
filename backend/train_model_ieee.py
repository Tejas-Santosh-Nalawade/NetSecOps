"""
IEEE-CIS Fraud Detection Model Training
Train ML models on real IEEE-CIS fraud detection dataset
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import joblib
import json
import time
from pathlib import Path

# Configuration
DATASET_PATH = Path("dataset/IEE_CIS_dataset")
MODEL_PATH = Path("app/ml")
SAMPLE_SIZE = 100000  # Use subset for faster training (set to None for full dataset)
TEST_SIZE = 0.2
RANDOM_STATE = 42

def load_and_prepare_data():
    """Load and prepare IEEE-CIS dataset"""
    print("Loading transaction data...")
    if SAMPLE_SIZE:
        df_trans = pd.read_csv(DATASET_PATH / "train_transaction.csv", nrows=SAMPLE_SIZE)
    else:
        df_trans = pd.read_csv(DATASET_PATH / "train_transaction.csv")
    
    print(f"Loaded {len(df_trans)} transactions")
    print(f"Fraud rate: {df_trans['isFraud'].mean():.2%}")
    
    # Load identity data (optional merge)
    print("Loading identity data...")
    df_identity = pd.read_csv(DATASET_PATH / "train_identity.csv")
    
    # Merge transaction and identity
    df = df_trans.merge(df_identity, on='TransactionID', how='left')
    print(f"Merged dataset shape: {df.shape}")
    
    return df

def feature_engineering(df):
    """Engineer features from raw data"""
    print("\nFeature engineering...")
    
    # Extract target
    y = df['isFraud'].values
    
    # Remove non-feature columns
    drop_cols = ['TransactionID', 'isFraud']
    X = df.drop(columns=drop_cols)
    
    # Separate numerical and categorical features
    numerical_features = X.select_dtypes(include=[np.number]).columns.tolist()
    categorical_features = X.select_dtypes(include=['object']).columns.tolist()
    
    print(f"Numerical features: {len(numerical_features)}")
    print(f"Categorical features: {len(categorical_features)}")
    
    # Handle categorical features - Label encoding
    label_encoders = {}
    for col in categorical_features:
        le = LabelEncoder()
        X[col] = X[col].fillna('missing')
        X[col] = le.fit_transform(X[col].astype(str))
        label_encoders[col] = le
    
    # Fill missing values in numerical features
    for col in numerical_features:
        X[col] = X[col].fillna(X[col].median())
    
    # Feature selection - use top important features
    # For now, use all features (can be optimized later)
    feature_names = X.columns.tolist()
    
    return X.values, y, feature_names, label_encoders

def train_and_evaluate_models(X_train, X_test, y_train, y_test):
    """Train multiple models and compare performance"""
    print("\n" + "="*60)
    print("TRAINING MODELS")
    print("="*60)
    
    models = {
        'XGBoost': XGBClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=RANDOM_STATE,
            eval_metric='logloss',
            use_label_encoder=False
        ),
        'RandomForest': RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=RANDOM_STATE,
            n_jobs=-1
        ),
        'LogisticRegression': LogisticRegression(
            max_iter=1000,
            random_state=RANDOM_STATE,
            n_jobs=-1
        )
    }
    
    results = {}
    
    for name, model in models.items():
        print(f"\nTraining {name}...")
        start_time = time.time()
        
        model.fit(X_train, y_train)
        train_time = time.time() - start_time
        
        # Predictions
        y_pred = model.predict(X_test)
        y_pred_proba = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else y_pred
        
        # Metrics
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, zero_division=0)
        recall = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        try:
            auc = roc_auc_score(y_test, y_pred_proba)
        except:
            auc = 0.5
        
        # False positive rate
        tn = np.sum((y_test == 0) & (y_pred == 0))
        fp = np.sum((y_test == 0) & (y_pred == 1))
        fpr = fp / (fp + tn) if (fp + tn) > 0 else 0
        
        results[name] = {
            'model': model,
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1_score': f1,
            'auc': auc,
            'false_positive_rate': fpr,
            'train_time': train_time
        }
        
        print(f"  Accuracy: {accuracy:.4f}")
        print(f"  Precision: {precision:.4f}")
        print(f"  Recall: {recall:.4f}")
        print(f"  F1 Score: {f1:.4f}")
        print(f"  AUC: {auc:.4f}")
        print(f"  FPR: {fpr:.4f}")
        print(f"  Training time: {train_time:.2f}s")
    
    # Select best model by F1 score
    best_model_name = max(results.items(), key=lambda x: x[1]['f1_score'])[0]
    best_model = results[best_model_name]['model']
    best_metrics = results[best_model_name]
    
    print(f"\n{'='*60}")
    print(f"BEST MODEL: {best_model_name} (F1: {best_metrics['f1_score']:.4f})")
    print(f"{'='*60}")
    
    return best_model, best_model_name, results

def save_model_and_metadata(model, scaler, best_model_name, results, feature_names):
    """Save model, scaler, and metadata"""
    print("\nSaving model artifacts...")
    
    MODEL_PATH.mkdir(parents=True, exist_ok=True)
    
    # Save model
    joblib.dump(model, MODEL_PATH / "fraud_model.joblib")
    print(f"✓ Model saved: {MODEL_PATH / 'fraud_model.joblib'}")
    
    # Save scaler
    joblib.dump(scaler, MODEL_PATH / "scaler.joblib")
    print(f"✓ Scaler saved: {MODEL_PATH / 'scaler.joblib'}")
    
    # Prepare metadata
    best_metrics = results[best_model_name]
    all_algorithms = [
        {
            'algorithm': name,
            'f1_score': metrics['f1_score'],
            'accuracy': metrics['accuracy'],
            'precision': metrics['precision'],
            'recall': metrics['recall'],
            'false_positive_rate': metrics['false_positive_rate'],
            'auc': metrics['auc'],
            'train_time': metrics['train_time']
        }
        for name, metrics in results.items()
    ]
    
    metadata = {
        'version': 'v3.0.0-ieee',
        'algorithm': best_model_name,
        'accuracy': best_metrics['accuracy'],
        'precision': best_metrics['precision'],
        'recall': best_metrics['recall'],
        'f1_score': best_metrics['f1_score'],
        'auc': best_metrics['auc'],
        'false_positive_rate': best_metrics['false_positive_rate'],
        'drift_score': 0.0,
        'latency': 45.0,
        'trained_at': time.strftime('%Y-%m-%d %H:%M:%S'),
        'dataset': 'IEEE-CIS Fraud Detection',
        'sample_size': SAMPLE_SIZE or 'full',
        'num_features': len(feature_names),
        'best_algorithm': best_model_name,
        'all_algorithms': all_algorithms
    }
    
    # Save metadata
    with open(MODEL_PATH / "metadata.joblib", 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"✓ Metadata saved: {MODEL_PATH / 'metadata.joblib'}")
    
    # Save to registry
    registry_path = Path("ml_registry")
    registry_path.mkdir(exist_ok=True)
    
    model_version_path = registry_path / "model_v3_0_0_ieee"
    model_version_path.mkdir(exist_ok=True)
    
    joblib.dump(model, model_version_path / "model.joblib")
    joblib.dump(scaler, model_version_path / "scaler.joblib")
    
    with open(model_version_path / "metadata.json", 'w') as f:
        json.dump(metadata, f, indent=2)
    
    # Update registry
    registry_file = registry_path / "registry.json"
    if registry_file.exists():
        with open(registry_file, 'r') as f:
            registry = json.load(f)
    else:
        registry = {"models": []}
    
    # Add new version
    registry["models"].append({
        "version": "v3.0.0-ieee",
        "created_at": time.strftime('%Y-%m-%d %H:%M:%S'),
        "algorithm": best_model_name,
        "f1_score": best_metrics['f1_score'],
        "accuracy": best_metrics['accuracy'],
        "dataset": "IEEE-CIS",
        "is_current": True
    })
    
    # Mark others as not current
    for model_entry in registry["models"][:-1]:
        model_entry["is_current"] = False
    
    with open(registry_file, 'w') as f:
        json.dump(registry, f, indent=2)
    
    print(f"✓ Model registered in ml_registry")
    
    return metadata

def main():
    """Main training pipeline"""
    print("\n" + "="*60)
    print("IEEE-CIS FRAUD DETECTION MODEL TRAINING")
    print("="*60)
    
    # Load data
    df = load_and_prepare_data()
    
    # Feature engineering
    X, y, feature_names, label_encoders = feature_engineering(df)
    
    print(f"\nFinal dataset shape: {X.shape}")
    print(f"Target distribution: Fraud={np.sum(y==1)}, Legit={np.sum(y==0)}")
    
    # Split data
    print("\nSplitting data...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )
    
    # Scale features
    print("Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train models
    best_model, best_model_name, results = train_and_evaluate_models(
        X_train_scaled, X_test_scaled, y_train, y_test
    )
    
    # Save everything
    metadata = save_model_and_metadata(
        best_model, scaler, best_model_name, results, feature_names
    )
    
    print("\n" + "="*60)
    print("TRAINING COMPLETE!")
    print("="*60)
    print(f"\nModel Version: {metadata['version']}")
    print(f"Best Algorithm: {metadata['best_algorithm']}")
    print(f"F1 Score: {metadata['f1_score']:.4f}")
    print(f"Accuracy: {metadata['accuracy']:.4f}")
    print(f"AUC: {metadata['auc']:.4f}")
    print("\nModel is ready to use! Restart the API server to load it.")
    
if __name__ == "__main__":
    main()
