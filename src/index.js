import React from "react";
import { storiesOf } from "@storybook/react";
import addons, { makeDecorator } from "@storybook/addons";
import { Polly } from "@pollyjs/core";
import FetchAdapter from "@pollyjs/adapter-fetch";
import RESTPersister from "@pollyjs/persister-rest";

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

function setupPolly({ recordName, recordingMode, matchRequestsBy }) {
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
  return polly;
}

const defaultConfig = {
  recordingMode: "replay",
  matchRequestsBy: undefined
};

export const withR2Request= makeDecorator({
  name: "withR2Request",
  parameterName: "r2Request",
  wrapper: (getStory, context, { parameters = {} }) => {
    const channel = addons.getChannel();
    let r2Request = parameters.re2Request || defaultConfig;
    const polly = setupPolly({
      recordName: `${context.kind}/${context.name}`,
      recordingMode: r2Request.recordingMode
    });

    polly.server.any().on("response", req => {
      channel.emit("r2request/new-request", {
        url: req.url,
        pathname: req.pathname,
        query: req.query,
        action: req.action
      });
    });

    channel.on("r2request/save-requests", async () => {
      await polly.stop();
    });

    return getStory(context);
  }
});
