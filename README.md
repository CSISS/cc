
[![Build Status](https://travis-ci.org/CSISS/cc.svg?branch=master)](https://travis-ci.org/CSISS/cc)

# CyberConnector

NSF EarthCube Building Block project

This project aims to connect the existing data sources to the Earth science models so the generation of modeling products could be more automatic and effortless. 

# Installation

## Prerequisite

JDK 1.8+

Tomcat 8.0+

MySQL 5.5+

ncWMS 2.4.1+

[cc-thredds-pycsw](https://github.com/CSISS/cc-thredds-pycsw)

Maven 3.5.0+

## Quick Start

### Java War Package

To use CyberConnector, [download](https://github.com/CSISS/cc/releases) the latest release war and copy it to the webapps directory of Tomcat. Start Tomcat. 

After the tomcat is fully started, configure the database connection. The configuration files are `WEB-INF/classes/config.properties` (database url, default: jdbc:mysql://localhost:3306/cyberconnector) and `WEB-INF/classes/cc_secret.properties` (database username and password: database_user=root database_password=xxxxxxxx). Fill the fields with correct values. (**Note: the database must be initiated first.**)

Then enter the following URL into browser address bar to open CyberConnector:

`http://your-ip:your-port/CyberConnector-<version>/web/CyberConnector`

Replace the `your-ip`, `your-port`, `CyberConnector-<version>` with the real name of your tomcat and downloaded CyberConnector package. For example, `localhost:8080`, `CyberConnector-0.6.6`.

### Cloud Instance Template

We provide a ready-to-use cloud template for you to install on mainstream cloud platforms like AWS, Google Cloud, Azure, OpenStack and CloudStack. Please go here to download the template.

### Docker Image

We published a Docker image in DockerHub for docker users. 

# Modules

COVALI - a sub-system for comparison and validation of atmospheric and other Earth science models (funded by [EarthCube CyberWay](http://cube.csiss.gmu.edu/CyberWay/web/index))

CyberConnector Searcher - a sub-system for searching Earth observations, model results or virtual data products (VDP)

CyberConnector Orderer - a sub-system for orderring VDP (customizing existing observations into ready-to-use format)

CyberConnector Service Register - a sub-system for registering and searching geoprocessing web services

# Usage



## Roam around the Globe

![roam](docs/ccportal.gif)

## Search Data

### search in UCAR THREDDS server


### search in the public folder


### search in broker


## Add Data


## Control Map


## Calculate Difference


## Statistic Report



## Animation of changes




# Demo Site

A demo instance has been deployed on George Mason University server. [here](http://cube.csiss.gmu.edu/CyberConnector/web/index)

# Developers

Ziheng Sun (zsun@gmu.edu)

Juozas Gaigalas (juozasgaigalas@gmail.com)

# Funders

National Science Foundation

![nsf](docs/logo_nsf.gif)


