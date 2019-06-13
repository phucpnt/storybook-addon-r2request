import { configure, addDecorator } from "@storybook/react";
import {withKnobs} from '@storybook/addon-knobs';
import { withR2Request } from "../src/index";

addDecorator(withR2Request);
addDecorator(withKnobs);

// automatically import all files ending in *.stories.js
const req = require.context("../stories", true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
