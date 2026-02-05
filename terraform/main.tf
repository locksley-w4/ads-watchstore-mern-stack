module "vpc" {
  source            = "./modules/vpc"
  vpc_cidr_block    = "10.1.0.0/16"
  subnet_cidr_block = "10.1.1.0/24"
  az_id             = var.az_id
  region            = var.region
}

module "ec2" {
  source          = "./modules/ec2"
  subnet_id       = module.vpc.subnet_id
  sg_list         = module.vpc.sg_list
  public_key_path = "${path.root}/keys/id.pub"
  depends_on      = [module.vpc]

  user_data_path = "${path.root}/scripts/docker-setup.sh"
}
