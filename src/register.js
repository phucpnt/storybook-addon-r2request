import React from "react";
import { styled } from "@storybook/theming";
import addons, { types } from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import { Button, Form } from "@storybook/components";

const { Field, Select } = Form;

// Register the addon with a unique name.
addons.register("r2Request", api => {
  // Also need to set a unique name to the panel.
  const channel = addons.getChannel();
  addons.addPanel("r2Request/panel", {
    type: types.PANEL,
    title: () => <R2RequestTitlePanel channel={channel} />,
    render: ({ active, key }) => {
      return (
        <R2RequestPanel
          active={active}
          key={key}
          channel={channel}
          api={api}
        />
      );
    }
  });
});

const Page = styled.div`
  padding: 1em;
`;

class R2RequestTitlePanel extends React.Component {
  state = {
    requestList: [],
    isHavingNewRecord: false,
    isHavingReplayRecord: false
  };
  componentDidMount() {
    const { channel } = this.props;
    channel.on("r2Request/new-request", this.onNewRequest);
    channel.on(STORY_RENDERED, this.onStoryChange);
  }

  onNewRequest = req => {
    this.setState({
      requestList: this.state.requestList.concat(req),
      isHavingNewRecord:
        this.state.isHavingNewRecord || req.action === "record",
      isHavingReplayRecord:
        this.state.isHavingReplayRecord || req.action === "replay"
    });
  };
  onStoryChange = story => {
    this.setState({
      requestList: [],
      isHavingNewRecord: false,
      isHavingReplayRecord: false
    });
  };

  render() {
    const { isHavingNewRecord, isHavingReplayRecord } = this.state;
    return (
      <div>
        {isHavingNewRecord && (
          <span title="have requests without recorded">🔴 </span>
        )}
        {isHavingReplayRecord && (
          <span title="have requests replayed">🎥 </span>
        )}{" "}
        R2Request
      </div>
    );
  }
}

class R2RequestPanel extends React.Component {
  state = {
    requestList: [],
    newRequestList: [],
    recordingMode: 'replay',
  };
  componentDidMount() {
    const { channel } = this.props;
    channel.on("r2Request/new-request", this.onNewRequest);
    channel.on(STORY_RENDERED, this.onStoryChange);
  }

  onStoryChange = story => {
    this.setState({ requestList: [], newRequestList: []});
  };
  onNewRequest = req => {
    this.setState({
      requestList: this.state.requestList.concat(req),
      newRequestList: req.action === 'record' ? this.state.newRequestList.concat(req) : this.state.newRequestList,
    });
  };

  recordRequest = () => {
    this.props.channel.emit("r2Request/persist-records");
  };

  onChangeRecordingMode = (mode) => {
    this.setState({recordingMode: mode});
  }

  refreshPage = () => {
    const {channel} = this.props;
    channel.emit('r2Request/refresh', {recordingMode: this.state.recordingMode});
  }

  render() {
    const { active } = this.props;
    const {newRequestList, requestList} = this.state;
    if (!active) {
      return null;
    }
    return (
      <Page>
        <Field key="recordMode" label="Recording mode">
          <Select value={this.state.recordingMode} onChange={(evt) => this.onChangeRecordingMode(evt.target.value)} size={1}>
            <option value="replay">Replay</option>
            <option value="record">Record</option>
          </Select>
        </Field>
        <br />
        <Button primary={newRequestList.length > 0} outline onClick={this.recordRequest}>
          Save requests ({requestList.length}) ({newRequestList.length} new)
        </Button>
        <Button secondary onClick={this.refreshPage}>
          Refresh page
        </Button>
      </Page>
    );
  }
}
