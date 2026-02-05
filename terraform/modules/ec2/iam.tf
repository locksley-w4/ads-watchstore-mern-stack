data "aws_iam_role" "s3_access" {
  name = "app-s3-access"
}

resource "aws_iam_instance_profile" "role_s3_access_profile" {
  name = "app-s3-access-profile"
  role = data.aws_iam_role.s3_access.name
}