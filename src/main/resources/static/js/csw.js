/**
 * Created by songj on 10/27/2015.
 */

function request(
    startPos, maxRecords, datasetID, resultSet, outScheme,
    west, east, north, south,
    startDate, endDate, anyText,
    startDate_name, endDate_name, datasetID_name) {

    startDate_name = startDate_name || "apiso:TempExtent_begin";
    endDate_name = endDate_name || "apiso:TempExtent_end";
    datasetID_name = datasetID_name || "apiso:Identifier"

    var profile = "gmd:MD_Metadata";

    var startDateReq= '';
    if(startDate)
        startDateReq = '\
        <ogc:PropertyIsGreaterThanOrEqualTo> \
            <ogc:PropertyName>' + startDate_name + '</ogc:PropertyName> \
            <ogc:Literal>' + startDate + '</ogc:Literal> \
        </ogc:PropertyIsGreaterThanOrEqualTo>';

    var endDateReq = '';
    if(endDate)
        endDateReq = '\
        <ogc:PropertyIsLessThanOrEqualTo> \
            <ogc:PropertyName>' + endDate_name + '</ogc:PropertyName> \
            <ogc:Literal>' + endDate + '</ogc:Literal> \
        </ogc:PropertyIsLessThanOrEqualTo>';

    var anyTextReq = '';
    if(anyText != '')
        anyTextReq = '\
            <ogc:PropertyIsLike wildCard="%" singleChar="_" escapeChar="\">\
                <ogc:PropertyName>apiso:AnyText</ogc:PropertyName>\
                <ogc:Literal>%' + anyText + '%</ogc:Literal> \
            </ogc:PropertyIsLike>';

    var datasetIDReq = '';
    if(datasetID != '')
        datasetIDReq = '\
            <ogc:PropertyIsLike wildCard="%" singleChar="_" escapeChar="\">\
                <ogc:PropertyName>' + datasetID_name + '</ogc:PropertyName>\
                <ogc:Literal>%' + datasetID + '%</ogc:Literal> \
            </ogc:PropertyIsLike>';

    var bboxReq = '';
    if(west != '' && east != '' && south != '' && north != '')
        bboxReq = '\
            <ogc:BBOX>\
                <ogc:PropertyName>ows:BoundingBox</ogc:PropertyName>\
                <gml:Envelope>\
                <gml:lowerCorner>' + south + ' ' + west + '</gml:lowerCorner>\
                <gml:upperCorner>' + north + ' ' + east + '</gml:upperCorner>\
                </gml:Envelope>\
            </ogc:BBOX>';

    condition = 0
    if(datasetIDReq != '') condition ++;
    if(anyTextReq != '') condition ++;
    if(startDateReq != '') condition ++;
    if(endDateReq != '') condition ++;
    if(bboxReq != '') condition ++;

    if(condition > 1)
        filter = '\
            <Constraint version="1.1.0"> \
                <ogc:Filter><ogc:And>' + datasetIDReq + anyTextReq + startDateReq + endDateReq + bboxReq + '</ogc:And></ogc:Filter>\
            </Constraint>';
    else if(condition == 1)
        filter = '\
            <Constraint version="1.1.0"> \
                <ogc:Filter>' + datasetIDReq + anyTextReq + startDateReq + endDateReq + bboxReq + '</ogc:Filter>\
            </Constraint>';
    else
        filter = ''

    var req = '<?xml version="1.0" encoding="UTF-8"?>\
        <GetRecords xmlns="http://www.opengis.net/cat/csw/2.0.2" \
            xmlns:ogc="http://www.opengis.net/ogc" \
            xmlns:gml="http://www.opengis.net/gml" \
            xmlns:gmd="http://www.isotc211.org/2005/gmd" \
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/cat/csw/2.0.2 http://schemas.opengis.net/csw/2.0.2/CSW-discovery.xsd" service="CSW" version="2.0.2" resultType="results" outputFormat="application/xml" outputSchema="'+outScheme+'" startPosition="'+ startPos +'" maxRecords="'+ maxRecords +'">\
            <Query typeNames="' + profile + '"> \
                <ElementSetName>' + resultSet + '</ElementSetName>' + filter + '\
            </Query>\
        </GetRecords>';

    return req;
}

function loadCatalog(catalogs) {

    function loadDatasets($catalogs) {
        var idx = $catalogs.val() - '0';
        var datasets = catalogs[idx].datasets;
        $datasets.empty();
        // $datasets.append($('<option value="">All</option>'));
        for(var i = 0; i < datasets.length; i++) {
            $datasets.append($('<option value="' + datasets[i].value + '">' + datasets[i].label + '</option>'));
        }
    }

    var $catalogs = $('.catalogs');
    var $datasets = $('.datasets');

    for(var i = 0; i < catalogs.length; i++) {
        var catalog = catalogs[i];
        $catalogs.append($('<option value="' + i + '">' + catalog.catalogId + '</option>'));
    }

    loadDatasets($catalogs);

    $catalogs.change(function(){
        loadDatasets($catalogs);
    });
}