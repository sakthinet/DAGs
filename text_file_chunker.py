from datetime import datetime, timedelta
from airflow import DAG
from airflow.providers.standard.operators.python import PythonOperator
from pdf2image import convert_from_path
import os
import psycopg2

# Default arguments for the DAG
default_args = {
    'owner': 'your_name',
    'depends_on_past': False,
    'start_date': datetime(2023, 1, 1),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

def process_text_file(input_path, chunk_size=1000):
    """
    Process a text file by splitting it into chunks and saving each chunk as a separate file.
    
    Args:
        input_path (str): Path to the input text file
        chunk_size (int): Maximum number of characters per chunk
    """
    # Read the input file
    with open(input_path, 'rb') as file:
        text = file.read()
    
    # Get the base filename without extension
    base_name = os.path.splitext(os.path.basename(input_path))[0]
    directory = os.path.dirname(input_path)
    
    # Split the text into chunks
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
    
    # Save each chunk as a separate file
    for i, chunk in enumerate(chunks, start=1):
        output_filename = f"{base_name}_chunk_{i}.txt"
        output_path = os.path.join(directory, output_filename)
        
        with open(output_path, 'wb') as file:
            file.write(chunk)
        
        print(f"Saved chunk {i} to {output_path}")

# Define the DAG
dag = DAG(
    'text_file_chunker',
    default_args=default_args,
    description='A DAG to split text files into chunks',
    schedule=None,  # Set to None for manual triggering
    catchup=False,
)

# Define the task
process_task = PythonOperator(
    task_id='process_text_file',
    python_callable=process_text_file,
    op_kwargs={
        'input_path': '/opt/airflow/data/input.txt',  # Change this to your actual file path
        'chunk_size': 1000  # Adjust chunk size as needed
    },
    dag=dag,
)

# Set task dependencies (in this case there's only one task)
process_task