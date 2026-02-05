resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr_block
  enable_dns_support   = true
  enable_dns_hostnames = true
}

resource "aws_subnet" "this" {
  availability_zone_id    = var.az_id
  vpc_id                  = aws_vpc.this.id
  cidr_block              = var.subnet_cidr_block
  map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
}

resource "aws_route_table" "this" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }
}

resource "aws_route_table_association" "this" {
  subnet_id      = aws_subnet.this.id
  route_table_id = aws_route_table.this.id
}

resource "aws_security_group" "allow_ssh" {
  name   = "allow_ssh"
  vpc_id = aws_vpc.this.id

  ingress {
    description      = "SSH"
    cidr_blocks      = var.sg_ssh_cidr_ipv4
    ipv6_cidr_blocks = var.sg_ssh_cidr_ipv6
    protocol         = "tcp"
    from_port        = 22
    to_port          = 22
  }

}

resource "aws_security_group" "allow_http" {
  name   = "allow_http"
  vpc_id = aws_vpc.this.id

  ingress {
    description      = "HTTP"
    cidr_blocks      = var.sg_http_cidr_ipv4
    ipv6_cidr_blocks = var.sg_http_cidr_ipv6
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