data "aws_eip" "existing_app_eip" {
  tags = {
    "Name" = "app-public-ip"
  }
}

resource "aws_eip_association" "app_eip_association" {
  instance_id   = aws_instance.app_ec2.id
  allocation_id = data.aws_eip.existing_app_eip.id

  depends_on = [aws_instance.app_ec2]
}