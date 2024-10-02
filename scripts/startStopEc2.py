import boto3
import time
import logging
import subprocess
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

# Initialize the EC2 client
ec2 = boto3.client('ec2')

# The instance ID you want to start and stop
INSTANCE_ID = 'i-018b699d0be51e521'  # Replace with your actual EC2 instance ID

def instance_exists(instance_id):
    """Check if the EC2 instance exists."""
    try:
        response = ec2.describe_instances(InstanceIds=[instance_id])
        if response['Reservations']:
            logger.info(f"EC2 instance {instance_id} exists.")
            return True
        else:
            logger.info(f"EC2 instance {instance_id} does not exist.")
            return False
    except Exception as e:
        logger.error(f"Error checking instance {instance_id}: {e}")
        return False

def start_instance(instance_id):
    """Starts an EC2 instance."""
    try:
        logger.info(f"Starting EC2 instance: {instance_id}")
        ec2.start_instances(InstanceIds=[instance_id])
        ec2.get_waiter('instance_running').wait(InstanceIds=[instance_id])
        logger.info(f"EC2 instance {instance_id} is now running.")
    except Exception as e:
        logger.error(f"Failed to start EC2 instance {instance_id}: {e}")

def run_terraform():
    """Run Terraform script to create the EC2 instance."""
    try:
        # Navigate to the directory where the Terraform main.tf is located
        os.chdir('./terraform')  # Replace with your directory
        logger.info("Initializing Terraform...")
        subprocess.run(['terraform', 'init'], check=True)
        
        logger.info("Applying Terraform script to create resources...")
        subprocess.run(['terraform', 'apply', '-auto-approve'], check=True)
        
        logger.info("Terraform applied successfully.")
    except subprocess.CalledProcessError as e:
        logger.error(f"Error running Terraform: {e}")
        raise

def stop_instance(instance_id):
    """Stops an EC2 instance."""
    try:
        logger.info(f"Stopping EC2 instance: {instance_id}")
        ec2.stop_instances(InstanceIds=[instance_id])
        ec2.get_waiter('instance_stopped').wait(InstanceIds=[instance_id])
        logger.info(f"EC2 instance {instance_id} is now stopped.")
    except Exception as e:
        logger.error(f"Failed to stop EC2 instance {instance_id}: {e}")

def destroy_terraform():
    try:
        logger.info("Applying Terraform script to create resources...")
        subprocess.run(['terraform', 'destroy', '-auto-approve'], check=True)

    except subprocess.CalledProcessError as e:
        logger.error(f"Error running Terraform: {e}")
        raise

def main():

     # Step 1: Check if the instance exists
    if instance_exists(INSTANCE_ID):
        start_instance(INSTANCE_ID)
        
    else:
        # Step 2: Run Terraform to create resources  
        run_terraform()

    
    # Step 2: Wait for 10 minutes (600 seconds)
    logger.info("Waiting for 10 minutes before stopping the instance...")
    time.sleep(600) 
    
    # Step 3: Stop the EC2 instance
    if instance_exists(INSTANCE_ID):
        stop_instance(INSTANCE_ID)
    else:
        destroy_terraform()

if __name__ == "__main__":
    main()
