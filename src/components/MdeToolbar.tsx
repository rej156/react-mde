import * as React from "react";
import { Command } from "../types";
import { MdeToolbarButtonGroup } from "./MdeToolbarButtonGroup";
import { MdeToolbarDropdown } from "./MdeToolbarDropdown";
import { MdeToolbarButton } from "./MdeToolbarButton";

export interface MdeToolbarProps {
  commands: Command[][];
  onCommand: (command: Command) => void;
  readOnly: boolean;
  stickyToolbar: boolean;
}

export interface MdeToolbarState {
  scrolled: boolean;
  stickyToolbar: boolean;
  scrollHeight?: number;
}

export class MdeToolbar extends React.Component<
  MdeToolbarProps,
  MdeToolbarState
> {
  constructor(props: MdeToolbarProps) {
    super(props);
    this.state = {
      scrolled: false,
      stickyToolbar: props.stickyToolbar,
      scrollHeight: null,
    };
    this.handleOnScroll = this.handleOnScroll.bind(this);
  }

  componentDidMount() {
    if (this.props.stickyToolbar) {
      window.addEventListener("scroll", this.handleOnScroll);
      window.addEventListener("touchend", this.handleOnScroll);
    }
  }

  handleOnScroll() {
    const scrollTop = window.scrollY;
    const toolbars = document.getElementsByClassName(
      "mde-header",
    ) as HTMLCollectionOf<HTMLElement>;
    const toolbarScroll = toolbars[0].offsetTop;
    if (!this.state.scrollHeight)
      this.setState({ scrollHeight: toolbarScroll });
    if (
      scrollTop > toolbarScroll &&
      this.state.scrolled === false &&
      this.props.stickyToolbar
    ) {
      this.setState({ scrolled: true }, () => {
        const containerDOMNode = document.querySelector(".container");
        if (containerDOMNode) {
          const stickyToolbarDOMNode = document.querySelector(
            ".sticky-toolbar",
          );
          if (stickyToolbarDOMNode) {
            (stickyToolbarDOMNode as HTMLElement).style.width = String(
              containerDOMNode.clientWidth,
            );
          }
        }
      });
    } else if (
      scrollTop < this.state.scrollHeight &&
      this.state.scrolled === true
    ) {
      this.setState({ scrolled: false });
    }
  }

  componentWillUnmount() {
    if (this.props.stickyToolbar) {
      window.removeEventListener("scroll", this.handleOnScroll);
      window.removeEventListener("touchend", this.handleOnScroll);
    }
  }

  render() {
    const { children, commands, onCommand, readOnly } = this.props;

    if ((!commands || commands.length === 0) && !children) {
      return null;
    }
    return (
      <div
        className={`mde-header ${this.state.scrolled ? "sticky-toolbar" : ""}`}
      >
        {commands.map((cg: Command[], i: number) => (
          <MdeToolbarButtonGroup key={i}>
            {cg.map((c: Command, j) => {
              if (c.children) {
                return (
                  <MdeToolbarDropdown
                    key={j}
                    buttonProps={c.buttonProps}
                    buttonContent={c.buttonContent}
                    commands={c.children}
                    onCommand={(cmd) => onCommand(cmd)}
                    readOnly={readOnly}
                  />
                );
              }
              return (
                <MdeToolbarButton
                  key={j}
                  buttonContent={c.buttonContent}
                  buttonProps={c.buttonProps}
                  onClick={() => onCommand(c as Command)}
                  readOnly={readOnly}
                />
              );
            })}
          </MdeToolbarButtonGroup>
        ))}
        <div className="mde-toolbar-children">{children}</div>
      </div>
    );
  }
}
