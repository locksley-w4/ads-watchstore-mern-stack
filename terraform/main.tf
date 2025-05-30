resource "google_compute_network" "app-network" {
    name = "app-network"
}

resource "google_compute_subnetwork" "app-subnet" {
    name = "app-subnet"
    network = google_compute_network.app-network.id
    ip_cidr_range = "10.0.0.0/24"
    region = var.region
}

resource "google_compute_firewall" "app-firewall" {
    name = "app-firewall"
    network = google_compute_network.app-network.id

    allow {
        protocol = "tcp"
        ports = [80, 443, 22]
    }

    source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_address" "app-website-address"{
    name = "app-website-address"
    region = var.region
}

resource "google_compute_instance" "app-frontend" {
    name = "app-frontend"
    machine_type = "e2-micro"
    zone = var.zone

    boot_disk {
      initialize_params {
        image = "ubuntu-os-cloud/ubuntu-2204-lts"
      }
    }

    network_interface {
      network = google_compute_network.app-network.id
      subnetwork = google_compute_subnetwork.app-subnet.id

      access_config {
        nat_ip = google_compute_address.app-website-address.address
      }
    }

    metadata = {
      ssh-keys = "ubuntu:${file(var.public_key_path)}"
    }
}

output "app-frontend" {
  value = google_compute_instance.app-frontend.network_interface[0].access_config[0].nat_ip
}