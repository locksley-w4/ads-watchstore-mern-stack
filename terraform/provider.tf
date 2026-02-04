terraform {
    required_providers {
      # google = {
      #   source = "hashicorp/google"
      #   version = "6.2.0"
      # }
      aws = {
        source = "hashicorp/aws"
        version = "~> 6.0"
      }
    }
}

provider aws {
  region = var.region
}

# provider "google" {
#     project = var.project_id
#     region = var.region
#     zone = var.zone
# }