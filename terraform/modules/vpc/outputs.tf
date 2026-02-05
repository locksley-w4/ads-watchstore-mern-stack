output "subnet_id" {
    value = aws_subnet.this.id
    description = "ID of the subnet resource managed bu this module."
}

output "sg_list" {
    value = [aws_security_group.allow_http.id, aws_security_group.allow_ssh.id]
    description = "List of security groups related to this VPC."
}