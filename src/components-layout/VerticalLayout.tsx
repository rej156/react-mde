import * as React from "react";
import {Command, LayoutProps} from "../types";
import {ReactMde} from "../ReactMde";
import {MdePreview, MdeEditor, MdeToolbar} from "../components";
import * as classNames from "classnames";

export interface VerticalLayoutOptions {
    editorClassName?: object | string | Array<object | string>;
    previewClassName?: object | string | Array<object | string>;
}

export class VerticalLayout extends React.Component<LayoutProps, {}> {
    editorRef: MdeEditor;
    previewRef: MdePreview;

    /**
     * Handler for the textArea value change
     * @memberOf ReactMde
     */
    handleMdeStateChange = (value) => {
        const {onChange} = this.props;
        onChange(value);
    }

    handleCommand = (command: Command) => {
        const {onCommand} = this.props;
        onCommand(command);
    }

    /**
     * Renders react-mde
     * @returns
     * @memberOf ReactMde
     */
    render() {
        const {commands, mdeEditorState, layoutOptions, emptyPreviewHtml, readOnly, stickyToolbar} = this.props;
        const finalLayoutOptions = layoutOptions ? {...layoutOptions} : {};

        return (
            <div className="react-mde-vertical-layout">
                <div style={{ margin: "200px 10px"}}>Test</div>
                <MdeToolbar
                    commands={commands}
                    onCommand={this.handleCommand}
                    readOnly={readOnly}
                    sticky={stickyToolbar}
                />
                <div className="react-mde-content">
                    <MdeEditor
                        className={classNames(finalLayoutOptions.editorClassName)}
                        editorRef={(c) => this.editorRef = c}
                        onChange={this.handleMdeStateChange}
                        editorState={mdeEditorState}
                        readOnly={readOnly}
                    />
                    <MdePreview
                        className={classNames(finalLayoutOptions.previewClassName)}
                        previewRef={(c) => this.previewRef = c}
                        html={mdeEditorState ? mdeEditorState.html : ""}
                        emptyPreviewHtml={emptyPreviewHtml}
                    />
                </div>
            </div>
        );
    }
}
