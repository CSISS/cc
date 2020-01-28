FROM fabric8/tomcat-8

USER root

RUN mkdir -p /home/geo2015
RUN chown -R jboss:root /home/geo2015
RUN yum install wget epel-release nco -y

USER jboss

WORKDIR /home/geo2015

RUN wget https://repo.continuum.io/archive/Anaconda3-2019.10-Linux-x86_64.sh
RUN bash Anaconda3-2019.10-Linux-x86_64.sh -b -p /home/geo2015/anaconda3
RUN rm Anaconda3-2019.10-Linux-x86_64.sh


RUN source /home/geo2015/anaconda3/etc/profile.d/conda.sh && conda create -n esmpy8 -y && conda install -y -n esmpy8  -c conda-forge "esmf!=*nompi" esmpy xarray=0.14.1 scipy dask netCDF4 xesmf libnetcdf=4.6.2 netcdf4=1.5.1


COPY *.war /maven/

COPY tomcat-users.xml /opt/tomcat/conf/