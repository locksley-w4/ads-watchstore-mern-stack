variable "public_key_path" {
  type        = string
  description = "Path for a ssh public key to enable ssh-connectivity to the instance"
}

variable "instance_type" {
  type = string
  default = "t3.micro"
}

variable "subnet_id" {
  type = string
  description = "ID of the subnet in which the instance is to be launched"
}

variable "sg_list" {
  type = list(string)
  description = "List of security group IDs to attach to the instance"
}

variable "user_data_path" {
  default = null
  description = "Complete path to the script file"
}