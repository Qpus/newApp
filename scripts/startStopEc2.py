import boto3
import time
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

# Initialize the EC2 client
ec2 = boto3.client('ec2')

# The instance ID you want to start and stop
INSTANCE_ID = 'your-instance-id-here'  # Replace with your actual EC2 instance ID

def start_instance(instance_id):
    """Starts an EC2 instance."""
    try:
        logger.info(f"Starting EC2 instance: {instance_id}")
        ec2.start_instances(InstanceIds=[instance_id])
        ec2.get_waiter('instance_running').wait(InstanceIds=[instance_id])
        logger.info(f"EC2 instance {instance_id} is now running.")
    except Exception as e:
        logger.error(f"Failed to start EC2 instance {instance_id}: {e}")

def stop_instance(instance_id):
    """Stops an EC2 instance."""
    try:
        logger.info(f"Stopping EC2 instance: {instance_id}")
        ec2.stop_instances(InstanceIds=[instance_id])
        ec2.get_waiter('instance_stopped').wait(InstanceIds=[instance_id])
        logger.info(f"EC2 instance {instance_id} is now stopped.")
    except Exception as e:
        logger.error(f"Failed to stop EC2 instance {instance_id}: {e}")

def main():
    # Step 1: Start the EC2 instance
    start_instance(INSTANCE_ID)
    
    # Step 2: Wait for 10 minutes (600 seconds)
    logger.info("Waiting for 10 minutes before stopping the instance...")
    time.sleep(600)  # 600 seconds = 10 minutes
    
    # Step 3: Stop the EC2 instance
    stop_instance(INSTANCE_ID)

if __name__ == "__main__":
    main()
