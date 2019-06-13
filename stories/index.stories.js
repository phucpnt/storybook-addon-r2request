import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { Button, Welcome } from "@storybook/react/demo";

storiesOf("Welcome", module).add("to Storybook", () => (
  <Welcome showApp={linkTo("Button")} />
));

storiesOf("R2Request", module).add("Demo app with fetch", () => {
  return <DemoApp />
});

class DemoApp extends React.Component {
  state = {
    todos: []
  };

  async componentDidMount() {
    const $work = new Array(100).fill(0).reduce(
      ($chain, _, index) =>
        $chain.then(() =>
          fetch(`https://jsonplaceholder.typicode.com/todos/${index + 1}`)
            .then(response => response.json())
            .then(json => {
              let { todos } = this.state;
              this.setState({ todos: todos.concat(json) });
            })
        ),
      Promise.resolve("start querying todo one by one")
    );

    await $work;
  }

  render() {
    const { todos } = this.state;
    return (
      <div>
        <h2>Todo list</h2>
        <ol>
          {todos.map(i => (
            <li key={i.id}>{i.title}</li>
          ))}
        </ol>
      </div>
    );
  }
}
