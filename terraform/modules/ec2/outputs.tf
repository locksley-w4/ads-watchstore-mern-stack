output "eip" {
  value = data.aws_eip.existing_app_eip.public_ip
}
