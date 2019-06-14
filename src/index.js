import React from "react";
import { storiesOf } from "@storybook/react";
import addons, { makeDecorator } from "@storybook/addons";
import { Polly } from "@pollyjs/core";
import FetchAdapter from "@pollyjs/adapter-fetch";
import RESTPersister from "@pollyjs/persister-rest";
import {
  STORY_CHANGED,
  FORCE_RE_RENDER,
  REGISTER_SUBSCRIPTION
} from "@storybook/core-events";

let polly = null;

function getPollyInstance(recordName, recordingMode) {
  return new Polly(recordName, {
    adapters: ["fetch"], // Hook into `fetch`
    persister: "rest", // Read/write to/from local-storage
    logging: false, // Log requests to console,
    recordFailedRequests: true,
    persisterOptions: {
      rest: {
        host: [window.location.protocol, "//", window.location.host].join("")
      }
    },
    mode: recordingMode
  });
}

let store = {
  polly: polly,
  config: null
};
function setupPolly({ recordName, recordingMode, matchRequestsBy }) {
  let polly = store.polly;

  if (!polly) {
    Polly.register(FetchAdapter);
    Polly.register(RESTPersister);
    polly = getPollyInstance(recordName, recordingMode);
  } else {
    polly.disconnect(FetchAdapter);
    polly = getPollyInstance(recordName, recordingMode);
  }
  polly.configure({
    matchRequestsBy
  });
  store.polly = polly;
  return polly;
}

const defaultConfig = {
  recordingMode: "replay",
  matchRequestsBy: undefined
};


export const withR2Request = makeDecorator({
  name: "withR2Request",
  parameterName: "r2Request",
  wrapper: (getStory, context, { parameters = {} }) => {
    const channel = addons.getChannel();
    let r2Request = store.config || parameters.re2Request || defaultConfig;

    const polly = setupPolly({
      recordName: `${context.kind}/${context.name}`,
      recordingMode: r2Request.recordingMode
    });
    

    polly.server.any().on("response", req => {
      channel.emit("r2Request/new-request", {
        url: req.url,
        pathname: req.pathname,
        query: req.query,
        action: req.action
      });
    });

    channel.emit(REGISTER_SUBSCRIPTION, registerR2Request);
    channel.emit("r2Request/config-change", r2Request);

    return React.cloneElement(getStory(context), {key: `r2Request-${r2Request.recordingMode}` });
  }
});

function registerR2Request() {
  const channel = addons.getChannel();
  channel.on("r2Request/persist-records", onSaveRecord);
  channel.on(STORY_CHANGED, resetStore);
  channel.on("r2Request/refresh", refresh);
  return disconnectR2Request;
}

function disconnectR2Request() {
  const channel = addons.getChannel();
  store.config = null;
  channel.removeListener("r2Request/persist-records", onSaveRecord);
  channel.removeListener(STORY_CHANGED, resetStore);
  channel.removeListener("r2Request/refresh", refresh);
}

function resetStore() {
  store.config = null;
}

async function onSaveRecord() {
  await store.polly.stop();
}

async function refresh(r2Request) {
  const channel = addons.getChannel();
  console.info("forceRequest");
  store.config = r2Request;
  channel.emit(FORCE_RE_RENDER);
}
