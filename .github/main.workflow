workflow "deploy on push" {
  on = "push"
  resolves = ["deploy"]
}

action "master branch only" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "install" {
  uses = "actions/npm@master"
  args = "install"
}

action "deploy" {
  uses = "actions/npm@master"
  needs = ["master branch only", "install"]
  args = "run-script deploy"
  secrets = ["GITHUB_TOKEN"]
}