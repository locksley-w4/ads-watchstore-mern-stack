variable "region" {
  type = string
}

variable "az_id" {
  type = string
}

variable "vpc_cidr_block" {
  type = string
}

variable "subnet_cidr_block" {
  type = string
}

variable "sg_ssh_cidr_ipv4" {
  type        = list(string)
  description = "Allowed IPv4 CIDR range for SSH access"
  default     = ["0.0.0.0/0"] # From anywhere. Restrict to specific in real prod env
}

variable "sg_ssh_cidr_ipv6" {
  type        = list(string)
  description = "Allowed IPv6 CIDR range for SSH access"
  default     = ["::/0"] # From anywhere. Restrict to specific in real prod env
}

variable "sg_http_cidr_ipv4" {
  type        = list(string)
  description = "Allowed IPv4 CIDR range for http access"
  default     = ["0.0.0.0/0"] # From anywhere
}

variable "sg_http_cidr_ipv6" {
  type        = list(string)
  description = "Allowed IPv6 CIDR range for http access"
  default     = ["::/0"] # From anywhere
}
