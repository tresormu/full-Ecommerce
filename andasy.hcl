# andasy.hcl app configuration file generated for ecommerceone on Wednesday, 04-Mar-26 09:11:57 CAT
#
# See https://github.com/quarksgroup/andasy-cli for information about how to use this file.

app_name = "ecommerceone"	
app {

  env = {}

  port = 8080

  compute {
    cpu      = 1
    memory   = 256
    cpu_kind = "shared"
  }

  process {
    name = "ecommerceone"
  }

}
