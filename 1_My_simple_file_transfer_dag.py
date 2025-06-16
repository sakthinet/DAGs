from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from datetime import datetime
import os
import shutil

source_dir = '/opt/airflow/files/source'
dest_dir = '/opt/airflow/files/destination'
source_file = os.path.join(source_dir, 'source.txt')
dest_file = os.path.join(dest_dir, 'source.txt')

def create_source_file():
    os.makedirs(source_dir, exist_ok=True)
    with open(source_file, 'w') as f:
        f.write("Airflow test content.\n")
    print(f"[create_source_file] Created: {source_file}")

def transfer_file():
    print(f"[transfer_file] Checking if source exists: {source_file}")
    if not os.path.exists(source_file):
        raise FileNotFoundError(f"[transfer_file] Source file not found: {source_file}")

    os.makedirs(dest_dir, exist_ok=True)
    shutil.copy2(source_file, dest_file)

    if not os.path.exists(dest_file):
        raise FileNotFoundError(f"[transfer_file] Copy failed: {dest_file} not created")
    print(f"[transfer_file] Copied {source_file} to {dest_file}")

def verify_transfer():
    if os.path.exists(dest_file):
        print(f"[verify_transfer] File successfully found at: {dest_file}")
    else:
        raise FileNotFoundError(f"[verify_transfer] Destination file missing: {dest_file}")

default_args = {
    'start_date': datetime(2025, 6, 16),
    'catchup': False
}

with DAG(
    dag_id='simple_file_transfer_dag',
    default_args=default_args,
    schedule_interval='@once',
    tags=['file', 'example'],
    description='Improved file transfer DAG with validation and logging'
) as dag:

    create_source_task = PythonOperator(
        task_id='create_source_file',
        python_callable=create_source_file
    )

    transfer_task = PythonOperator(
        task_id='transfer_file',
        python_callable=transfer_file
    )

    verify_task = PythonOperator(
        task_id='verify_transfer',
        python_callable=verify_transfer
    )

    cleanup_task = BashOperator(
        task_id='cleanup_source',
        bash_command=f'rm -f {source_file}'
    )

    create_source_task >> transfer_task >> verify_task >> cleanup_task
