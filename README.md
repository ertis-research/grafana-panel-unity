# Unity plugin for Grafana

This plugin allows the rendering of Unity WebGL builds in a Grafana panel, which can be placed on any dashboard. Furthermore, the panel allows two-way interaction between the Grafana dashboard and the Unity 3D build. It has been designed specifically to support [our digital twin platform](https://github.com/ertis-research/digital-twins-platform), but can be used in other scenarios.

## Table of Contents
- [Changelog](#changelog)
- [Installation](#installation)
   - [Requirements](#requirements)
   - [Build plugin](#build-plugin)
   - [Activation](#activation)
- [Usage](#usage)
- [License](#license)

## Changelog

## Installation

### Requirements
- [Grafana >= 7.0](https://grafana.com/)
- [NodeJS >= 14](https://nodejs.org/es/)
- [yarn](https://yarnpkg.com/)

### Build plugin

This plugin is like any other Grafana plugin, so you can also follow the instructions on their page. It is also explained step-by-step below.

1. Download the code or clone it.
   ```bash
   git clone https://github.com/ertis-research/unity-plugin-for-grafana.git
   ```
2. Move the code to the folder you have assigned in Grafana for plugins. This folder is indicated in the Grafana [configuration file](https://grafana.com/docs/grafana/v9.0/setup-grafana/configure-grafana/#plugins), where you can also change its path if you see it convenient. 

3. The plugin is currently unsigned, so it is necessary to activate Grafana's development mode to use it. To do this, the [*app_mode*](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/#app_mode) variable in the Grafana configuration file must be changed to *development* and then Grafana must be [restarted](https://grafana.com/docs/grafana/v9.0/setup-grafana/restart-grafana/).

4. Access the root folder of the code in a terminal.

5. Run the following command to install the dependencies. 
   ```bash
   yarn install
   ```

6. Run the following command to build the plugin.
   ```bash
   yarn dev
   ```
7. For Grafana to detect the plugin for the first time it usually needs to be [restarted](https://grafana.com/docs/grafana/v9.0/setup-grafana/restart-grafana/).

At this point the plugin should already be installed and activated. If we go into Grafana and enter `configuration > plugins`, it will be in the list. 

![Plugin in list](src/img/readme/plugins-list-unity.JPG)

## Usage

<<<<<<< HEAD
### Unity build requirements
The content of the Unity build will depend on what is being reproduced, but **in all cases it must have certain requirements**. 

The Unity model shall include the X script, which basically removes the capture of all keyboard inputs by Unity. This will allow the rest of the Grafana dashboard functions to still be used without any problems. This script should be added to any element of the model that will always be rendered (e.g. the main camera). You can also skip the file and add the instruction it contains directly to one of your scripts, the important thing is that you disable that function.

In addition to this script, it is important to build the Unity model correctly. In `File > Build Settings...` choose the **WebGL format** and in `Player Settings...` disable the compression format. It is not necessary to modify the default value of the rest of the other build options.

Build Settings             |  Project Settings  
:-------------------------:|:-------------------------:
![](src/img/readme/unity-export-1.JPG)  |  ![](src/img/readme/unity-export-1.JPG)

### Adding Unity panel to Grafana dashboard

### Load Unity build in the panel

### Unity to Grafana interaction

### Grafana to Unity interaction

=======
>>>>>>> c278e1af8cd60d255d5ea56872baee42e5f59a24
## License
