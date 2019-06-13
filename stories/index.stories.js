import React from "react";

import { storiesOf } from "@storybook/react";
import { linkTo } from "@storybook/addon-links";
import { text } from '@storybook/addon-knobs';



storiesOf("R2Request", module).add("Demo app with fetch", () => {
  const txt = text('abc', 'Hello');
  return <DemoApp title={txt} />
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
        <h2>{this.props.title}</h2>
        <ol>
          {todos.map(i => (
            <li key={i.id}>{i.title}</li>
          ))}
        </ol>
      </div>
    );
  }
}
