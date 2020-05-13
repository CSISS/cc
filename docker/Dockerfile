FROM fabric8/tomcat-8
# Use build.sh to setup the correct docker context

USER root

RUN yum install wget epel-release -y
RUN yum install nco -y

RUN ln -s /opt/jboss /home/geo2015

USER jboss

WORKDIR /opt/jboss
RUN mkdir -p /opt/jboss/covali-workspace

RUN wget https://repo.continuum.io/archive/Anaconda3-2019.10-Linux-x86_64.sh
RUN bash Anaconda3-2019.10-Linux-x86_64.sh -b -p /opt/jboss/anaconda3
RUN rm Anaconda3-2019.10-Linux-x86_64.sh


RUN source /home/geo2015/anaconda3/etc/profile.d/conda.sh && conda create -n esmpy8 -y && conda install -y -n esmpy8  -c conda-forge "esmf!=*nompi" esmpy xarray=0.14.1 scipy dask netCDF4 xesmf libnetcdf=4.6.2 netcdf4=1.5.1


COPY *.war /maven/

COPY tomcat-users.xml /opt/tomcat/conf/

COPY cc.mv.db /opt/jboss/covali-workspace/