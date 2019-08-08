workflow "New workflow" {
  on = "push"
  resolves = ["Deploy to GitHub Pages"]
}

action "master branch only" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Deploy to gh-pages" {
  uses = "JamesIves/github-pages-deploy-action@master" 
  env = {
    BRANCH = "gh-pages"
    BUILD_SCRIPT = "npm install && parcel build src/index.html --public-url /last-time/"
    FOLDER = "dist"
  }
  needs = ["master branch only"]
}
