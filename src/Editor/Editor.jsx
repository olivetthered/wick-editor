import React, { Component } from 'react';
import './_editor.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'react-reflex/styles.css'
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex'

import DockedPanel from './Panels/DockedPanel/DockedPanel';
import Canvas from './Panels/Canvas/Canvas';
import Inspector from './Panels/Inspector/Inspector';
import MenuBar from './Panels/MenuBar/MenuBar';
import Timeline from './Panels/Timeline/Timeline';
import Toolbox from './Panels/Toolbox/Toolbox';
import AssetLibrary from './Panels/AssetLibrary/AssetLibrary';
import CodeEditor from './Panels/CodeEditor/CodeEditor';
import ModalHandler from './Modals/ModalHandler/ModalHandler';

class Editor extends Component {

  constructor () {
    super();

    this.state = {
      project: null,
      openModalName: null,
      fillColor: '#ff0000',
      strokeColor: '#ffff00',
      activeTool: 'potraceBrush',
    }

    this.resizeProps = {
      onStopResize: this.onStopResize.bind(this),
      onResize: this.onResize.bind(this)
    }

    this.updateProjectSettings = this.updateProjectSettings.bind(this);
    this.openModal = this.openModal.bind(this);
    this.activateTool = this.activateTool.bind(this);
  }

  componentWillMount () {
    var project = new window.Wick.Project();
    this.setState({project: project});
  }

  onResize (e) {
    window.dispatchEvent(new Event('resize'));
  }

  onStopResize (e) {

  }

  openModal (name) {
    this.setState({
      openModalName: name,
    });
  }

  activateTool (toolName) {
    window.paper.drawingTools[toolName].activate();
    this.setState({
      activeTool: toolName
    });
  }

  updateProjectSettings (settings) {
    var nextProject = window.Wick.Project.deserialize(this.state.project.serialize());
    nextProject.name = settings.name;
    nextProject.width = settings.width;
    nextProject.height = settings.height;
    nextProject.framerate = settings.framerate;
    nextProject.backgroundColor = settings.backgroundColor;
    nextProject.focus.timeline.layers[0].frames[0].end = 10;

    this.setState(prevState => ({
      project: nextProject,
    }));
  }

  render () {
      return (
        <ReflexContainer orientation="horizontal">
          <ReflexElement className="header" flex={0.05}>
            <ModalHandler openModal={this.openModal}
                          openModalName={this.state.openModalName}
                          project={this.state.project}
                          updateProjectSettings={this.updateProjectSettings} />
            {/* Header */}
            <DockedPanel><MenuBar openModal={this.openModal} /></DockedPanel>
          </ReflexElement>
          <ReflexElement {...this.resizeProps}>
            <ReflexContainer orientation="vertical">

              <ReflexElement flex={0.05} {...this.resizeProps}>
                {/* Left Sidebar */}
                <DockedPanel>
                  <Toolbox
                    activeTool={this.state.activeTool}
                    fillColor={this.state.fillColor}
                    strokeColor={this.state.strokeColor}
                    activateTool={this.activateTool}
                  />
                </DockedPanel>
              </ReflexElement>

              <ReflexElement {...this.resizeProps}>
                {/* Middle Panel */}
                <ReflexContainer orientation="horizontal">
                  <ReflexElement flex={0.2} {...this.resizeProps}>
                    <DockedPanel>
                      <Timeline
                        focus={this.state.project.focus}
                      />
                    </DockedPanel>
                  </ReflexElement>
                  <ReflexSplitter {...this.resizeProps}/>
                  <ReflexElement {...this.resizeProps}>
                    <DockedPanel><Canvas /></DockedPanel>
                  </ReflexElement>
                  <ReflexSplitter {...this.resizeProps}/>
                  <ReflexElement flex={0.2} {...this.resizeProps}>
                    <DockedPanel><CodeEditor /></DockedPanel>
                  </ReflexElement>
                </ReflexContainer>
              </ReflexElement>

              <ReflexSplitter {...this.resizeProps}/>

              <ReflexElement flex={0.2} {...this.resizeProps}>
                {/* Right Sidebar */}
                <ReflexContainer orientation="horizontal">
                  <ReflexElement {...this.resizeProps}>
                    <DockedPanel><Inspector /></DockedPanel>
                  </ReflexElement>

                  <ReflexSplitter {...this.resizeProps}/>

                  <ReflexElement {...this.resizeProps}>
                    <DockedPanel><AssetLibrary /></DockedPanel>
                  </ReflexElement>
                </ReflexContainer>
              </ReflexElement>

            </ReflexContainer>
          </ReflexElement>
        </ReflexContainer>
      )
  }
}

export default Editor
