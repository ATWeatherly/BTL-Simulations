// creates dynamic routing
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;

  // page.matchPath is a special key that's used for matching pages only on the client.
  if (page.path.match(/^\/sim/)) {
    page.matchPath = "/sim/*";

    // update the page
    createPage(page);
  } else if (page.path.match(/^\/tutorial/)) {
    page.matchPath = "/tutorial/*";

    createPage(page);
  }
}

exports.onCreateWebpackConfig = ({ actions, stage }) => {
  if (stage === 'build-javascript') {
    actions.setWebpackConfig({
      devtool: false
    });
  }
};