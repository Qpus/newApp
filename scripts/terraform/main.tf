provider "aws" {
  region = "us-east-1"  # Replace with your desired region
}

resource "aws_instance" "example" {
  ami           = "ami-0ebfd941bbafe70c6"  # Replace with the latest valid AMI ID for your region
  instance_type = "t2.micro"               # Instance type

  tags = {
    Name = "PythonTerraformEC2Instance"
  }

  # Add key_name if you want to use an existing key pair to access the instance
   key_name = "sale"

  # Security group allowing SSH
  vpc_security_group_ids = [aws_security_group.allow_ssh.id]

  # Provision a script to run at launch (optional)
  user_data = <<-EOF
              #!/bin/bash
              
              curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
              source ~/.bashrc
              nvm install --lts

              sudo dnf install git -y
              git clone https://github.com/Qpus/newApp.git
              cd newApp/api

              npm install
              npm install pm2 -g

              pm2 start server.js
              EOF
}

# Create a security group to allow SSH and HTTP
resource "aws_security_group" "allow_ssh" {
  name        = "allow_ssh"
  description = "Allow SSH inbound traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "instance_id" {
  value = aws_instance.example.id
  description = "The ID of the EC2 instance"
}

output "instance_public_ip" {
  value = aws_instance.example.public_ip
}

output "instance_public_dns" {
  value = aws_instance.example.public_dns
}

