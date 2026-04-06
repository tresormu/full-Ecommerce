# andasy.hcl app configuration file generated for ecommerceone on Tuesday, 10-Mar-26 15:54:21 CAT
#
# See https://github.com/quarksgroup/andasy-cli for information about how to use this file.

app_name = "ecommerceone"

app {

  env = {}

  port = 8080

  primary_region = "fsn"

  compute {
    cpu      = 1
    memory   = 256
    cpu_kind = "shared"
  }

  process {
    name = "ecommerceone"
  }

}
