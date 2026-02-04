resource "aws_vpc" "main_vpc" {
  cidr_block           = "10.1.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
}

resource "aws_subnet" "main_subnet_public" {
  availability_zone_id    = var.az_id
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = "10.1.1.0/24"
  map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "main_igw" {
  vpc_id = aws_vpc.main_vpc.id
}

resource "aws_route_table" "main_rt_public" {
  vpc_id = aws_vpc.main_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main_igw.id
  }
}

resource "aws_route_table_association" "main_rt_public_association" {
  subnet_id      = aws_subnet.main_subnet_public.id
  route_table_id = aws_route_table.main_rt_public.id
}

# resource "aws_security_group" "main_sg_allow_db_egress" {
#   name   = "main_sg_allow_db_egress"
#   vpc_id = aws_vpc.main_vpc.id

#   egress {
#     description      = "MONGO_DB"
#     cidr_blocks      = ["0.0.0.0/0"]
#     ipv6_cidr_blocks = ["::/0"]
#     protocol         = "tcp"
#     from_port        = 27017
#     to_port          = 27017
#   }

# }

resource "aws_security_group" "main_sg_allow_ssh" {
  name   = "main_sg_allow_ssh"
  vpc_id = aws_vpc.main_vpc.id

  ingress {
    description      = "SSH"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
    protocol         = "tcp"
    from_port        = 22
    to_port          = 22
  }

}

resource "aws_security_group" "main_sg_allow_http" {
  name   = "main_sg_allow_http"
  vpc_id = aws_vpc.main_vpc.id

  ingress {
    description      = "HTTP"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
    protocol         = "tcp"
    from_port        = 80
    to_port          = 80
  }

  egress {
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
  }

}

data "aws_ami" "amzn-linux-2023-ami" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

data "aws_iam_role" "s3_access" {
  name = "app-s3-access"
}

resource "aws_iam_instance_profile" "role_s3_access_profile" {
  name = "app-s3-access-profile"
  role = data.aws_iam_role.s3_access.name
}

resource "aws_key_pair" "app_ssh" {
  key_name   = "app-ssh"
  public_key = file("./id.pub")
}

resource "aws_instance" "app_ec2" {
  ami           = data.aws_ami.amzn-linux-2023-ami.id
  instance_type = "t3.micro"
  # associate_public_ip_address = true
  subnet_id              = aws_subnet.main_subnet_public.id
  iam_instance_profile   = aws_iam_instance_profile.role_s3_access_profile.name
  vpc_security_group_ids = [aws_security_group.main_sg_allow_http.id, aws_security_group.main_sg_allow_ssh.id]
  key_name               = aws_key_pair.app_ssh.key_name
}

data "aws_eip" "existing_app_eip" {
  tags = {
    "Name" = "app-public-ip"
  }
}

resource "aws_eip_association" "app_eip_association" {
  instance_id   = aws_instance.app_ec2.id
  allocation_id = data.aws_eip.existing_app_eip.id

  depends_on = [ aws_instance.app_ec2 ]
}

output "eip" {
  value = data.aws_eip.existing_app_eip.public_ip
}
