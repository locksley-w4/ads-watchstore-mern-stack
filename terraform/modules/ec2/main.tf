resource "aws_key_pair" "app_ssh" {
  key_name   = "app-ssh"
  public_key = file(var.public_key_path)
}

resource "aws_instance" "app_ec2" {
  ami           = data.aws_ami.amzn-linux-2023-ami.id
  instance_type = var.instance_type
  # associate_public_ip_address = true
  subnet_id                   = var.subnet_id
  iam_instance_profile        = aws_iam_instance_profile.role_s3_access_profile.name
  vpc_security_group_ids      = var.sg_list
  key_name                    = aws_key_pair.app_ssh.key_name
  user_data_replace_on_change = true
  user_data                   = var.user_data_path != null ? file(var.user_data_path) : null
}
