/** @license
 | Version 10.1.1
 | Copyright 2012 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
var orientationChange = false; //variable for setting the flag on orientation
var tinyResponse; //variable for storing the response getting from tiny URL api
var tinyUrl; //variable for storing the tiny URL

//Function for refreshing address container div
function RemoveChildren(parentNode) {
    if (parentNode) {
        while (parentNode.hasChildNodes()) {
            parentNode.removeChild(parentNode.lastChild);
        }
    }
}

//function to remove scroll bar
function RemoveScrollBar(container) {
    if (dojo.byId(container.id + 'scrollbar_track')) {
        container.removeChild(dojo.byId(container.id + 'scrollbar_track'));
    }
}

//function to reset service request values
function ResetRequestFields() {
    dojo.byId("txtSelectedRequest").value = "";
    dojo.byId('txtDescription').value = "";
    dojo.byId('txtName').value = "";
    dojo.byId('txtPhone').value = "";
    dojo.byId('txtMail').value = "";
    dojo.byId('txtFileName').value = "";
    dojo.byId('formFileUplaod').reset();
    dojo.byId('spanServiceErrorMessage').innerHTML = "";
    dojo.byId('divRequestTypes').style.display = "none";

}

//function to show add service request info window
function AddServiceRequest(mapPoint) {
    selectedMapPoint = mapPoint;
    ResetRequestFields();
    RemoveScrollBar(dojo.byId("divInfoDetails"));
    dojo.byId("divInfoDetails").style.position = "";
    dojo.byId("spanServiceErrorMessage").innerHTML = "";
    dojo.byId("divRequestTypes").top = dojo.coords("txtSelectedRequest").h + dojo.byId("txtSelectedRequest").style.height;
    map.getLayer(tempGraphicsLayerId).clear();
    map.infoWindow.hide();
    if (isMobileDevice) {
        dojo.byId("submitDiv").style.bottom = "5px";
    }
    if (!isMobileDevice) {
        dojo.byId("divCreateRequestContainer").style.display = "none";
        dojo.byId("divInfoContent").style.display = "none";
        dojo.byId("divCreateRequestContainer").style.width = infoPopupWidth + "px";
        dojo.byId("divCreateRequestContainer").style.height = infoPopupHeight + "px";
    }
    if (serviceRequestSymbol) {
        var graphic = new esri.Graphic(mapPoint, serviceRequestSymbol, null, null);
        map.getLayer(tempGraphicsLayerId).add(graphic);
        (isMobileDevice) ? map.infoWindow.resize(225, 60) : map.infoWindow.resize(infoPopupWidth, infoPopupHeight);

        if (!isMobileDevice) {
            map.setExtent(GetBrowserMapExtent(selectedMapPoint));
        }
        else {
            map.setExtent(GetMobileMapExtent(selectedMapPoint));
        }
        setTimeout(function () {
            var screenPoint = map.toScreen(selectedMapPoint);
            screenPoint.y = map.height - screenPoint.y;
            map.infoWindow.show(screenPoint);
            if (isMobileDevice) {
                map.infoWindow.setTitle("Submit Details");
                dojo.connect(map.infoWindow.imgDetailsInstance(), "onclick", function () {
                    ResetRequestFields();
                    if (isMobileDevice) {
                        ShowCreateRequestContainer();
                        map.infoWindow.hide();
                    }
                    SetCreateRequestHeight();
                });
                map.infoWindow.setContent("");
            }
            else {
                dojo.byId("divCreateRequestContainer").style.display = "block";
                dojo.byId("divCreateRequestContent").style.display = "block";
                SetCreateRequestHeight();
            }
        }, 500)
    }
}

//function to show create request container
function ShowCreateRequestContainer() {
    dojo.byId("divInfoDetails").style.display = "none";
    dojo.byId("divCreateRequest").style.display = "block";
    dojo.replaceClass("divCreateRequest", "opacityShowAnimation", "opacityHideAnimation");
    dojo.byId("divCreateRequestContent").style.display = "block";
    dojo.replaceClass("divCreateRequestContainer", "showContainer", "hideContainer");

}

//function to show toggle request types
function ToggleRequestTypesList() {
    dojo.byId("divRequestTypes").style.display = (dojo.byId("divRequestTypes").style.display == "block") ? "none" : "block";
    dojo.byId("divCreateRequestContentscrollbar_handle").style.position = (dojo.byId("divRequestTypes").style.display == "block") ? "static" : "relative";
    dojo.byId("divRequestTypes").style.width = (dojo.coords("divDropdown").w - 2) + "px";
    CreateScrollbar(dojo.byId("divScrollBarContainer"), dojo.byId("divScrollBarContent"));
}

//Function for Clearing graphics on map
function ClearGraphics() {
    if (map.getLayer(tempGraphicsLayerId)) {
        map.getLayer(tempGraphicsLayerId).clear();
    }
}

//function to show comments view
function ShowCommentsView() {
    if (showCommentsTab) {
        dojo.byId("imgComments").style.display = "none";
        dojo.byId('imgDirections').src = "images/Details.png";
        dojo.byId('imgDirections').title = "Details";
        dojo.byId('imgDirections').setAttribute("disp", "Details");
        dojo.byId("imgDirections").style.display = "block";
        ResetCommentValues();
        dojo.byId('divInfoComments').style.display = "block";
        dojo.byId('divInfoDetails').style.display = "none";
        SetCommentHeight();
    }
}

//function to show service request details info window
function ShowServiceRequestDetails(mapPoint, attributes) {
    dojo.byId("divInfoDetails").style.position = "relative";
    map.infoWindow.hide();
    if (showCommentsTab) {
        dojo.byId("imgComments").style.display = "block";
    }
    else {
        dojo.byId("imgComments").style.display = "none";
        dojo.byId("imgComments").style.width = 0 + "px";
    }
    if (!isMobileDevice) {
        dojo.byId('divCreateRequestContainer').style.display = "none";
        dojo.byId('divInfoContent').style.display = "none";
        dojo.byId('divInfoContent').style.width = infoPopupWidth + "px";
        dojo.byId('divInfoContent').style.height = infoPopupHeight + "px";
    }
    for (var i in attributes) {
        if (!attributes[i]) {
            attributes[i] = "";
        }
    }
    selectedRequestStatus = attributes.STATUS;
    map.getLayer(tempGraphicsLayerId).clear();

    (isMobileDevice) ? map.infoWindow.resize(225, 60) : map.infoWindow.resize(infoPopupWidth, infoPopupHeight);
    if (!isMobileDevice) {
        map.setExtent(GetBrowserMapExtent(mapPoint));
    }
    else {
        map.setExtent(GetMobileMapExtent(mapPoint));
    }
    setTimeout(function () {
        selectedMapPoint = mapPoint;
        var screenPoint = map.toScreen(selectedMapPoint);
        screenPoint.y = map.height - screenPoint.y;

        map.infoWindow.show(screenPoint);
        if (isMobileDevice) {
            var header;
            if (dojo.string.substitute(infoWindowHeader, attributes)) {
                header = dojo.string.substitute(infoWindowHeader, attributes).trimString(Math.round(225 / 14));
            }
            else {
                header = dojo.string.substitute(infoWindowHeader, attributes);
            }
            map.infoWindow.setTitle(header);
            dojo.connect(map.infoWindow.imgDetailsInstance(), "onclick", function () {
                if (isMobileDevice) {
                    selectedMapPoint = null;
                    map.infoWindow.hide();
                    ShowServiceRequestContainer();
                }
                dojo.byId('divInfoContent').style.display = "block";
                ServiceRequestDetails(attributes);
            });
            var cont;
            if (dojo.string.substitute(infoWindowContent, attributes).trimString) {
                cont = dojo.string.substitute(infoWindowContent, attributes).trimString(Math.round(225 / 12));
            }
            else {
                cont = dojo.string.substitute(infoWindowContent, attributes);
            }
            map.infoWindow.setContent(cont);
        }
        else {
            ServiceRequestDetails(attributes);
        }
    }, 500);
}

//function to create service request details view
function ServiceRequestDetails(attributes) {
    ShowInfoDirectionsView();
    if (!isMobileDevice) {
        dojo.byId('divInfoContent').style.display = "block";
        dojo.byId("divInfoDetails").style.display = "block";
    }
    RemoveChildren(dojo.byId('tblInfoDetails'));
    RemoveChildren(dojo.byId('divCommentsContent'));
    if (isBrowser) {
        value = dojo.string.substitute(infoWindowHeader, attributes).trim();
        value = value.trimString(Math.round(infoPopupWidth / 6));

        if (value.length > Math.round(infoPopupWidth / 6)) {
            dojo.byId('tdInfoHeader').title = dojo.string.substitute(infoWindowHeader, attributes);
        }
    }
    else {
        value = dojo.string.substitute(infoWindowHeader, attributes).trim();
        value = value.trimString(Math.round(infoPopupWidth / 10));
    }
    dojo.byId('tdInfoHeader').innerHTML = value;
    var tblInfoDetails = dojo.byId('tblInfoDetails');
    var tbody = document.createElement("tbody");
    tblInfoDetails.appendChild(tbody);
    var date = new js.date();
    for (var index in infoWindowData) {
        var tr = document.createElement("tr");
        tbody.appendChild(tr);
        switch (infoWindowData[index].DataType) {
            case "string":

                CreateTableRow(tr, infoWindowData[index].DisplayText, dojo.string.substitute(infoWindowData[index].AttributeValue, attributes));

                break;
            case "date":
                var utcMilliseconds = Number(dojo.string.substitute(infoWindowData[index].AttributeValue, attributes));
                CreateTableRow(tr, infoWindowData[index].DisplayText, dojo.date.locale.format(date.utcToLocal(date.utcTimestampFromMs(utcMilliseconds)), { datePattern: formatDateAs, selector: "date" }));
                break;

        }
    }
    FetchRequestComments(attributes.REQUESTID);
    FetchAttachmentDetails(attributes[map.getLayer(serviceRequestLayerId).objectIdField], tbody);
    SetViewDetailsHeight();
}

//function to create table row
function CreateTableRow(tr, displayName, value) {
    var td = document.createElement("td");
    td.innerHTML = displayName;
    td.style.height = "18px";
    td.style.width = "120px";
    td.vAlign = "middle";
    td.style.paddingTop = "5px";
    var td1 = document.createElement("td");
    td1.style.width = "180px";
    td1.style.paddingTop = "5px";
    if (displayName == "Comment:") {
        td.vAlign = "top";
        if (value == "") {
            value = messages.getElementsByTagName("noComment")[0].childNodes[0].nodeValue;
        }
        else {

            var wordCount = value.split(/\n/).length;
            if (wordCount > 1) {
                var value1 = value.split(/\n/)[0].length == 0 ? "<br>" : value.split(/\n/)[0].trim();
                for (var c = 1; c < wordCount; c++) {
                    var comment;
                    if (value1 != "<br>") {
                        comment = value.split(/\n/)[c].trim().replace("", "<br>");
                    }
                    else {
                        comment = value.split(/\n/)[c].trim();
                    }
                    value1 += value.split(/\n/)[c].length == 0 ? "<br>" : comment;
                }
            }
            else {
                value1 = value;
            }
            td1.innerHTML += value1;
            if (CheckMailFormat(value) || dojo.string.substitute(value).match("http:" || "https:")) {
                td1.className = "tdBreakWord";
            }
            else {
                td1.className = "tdBreak";
            }
            var x = value.split(" ");
            for (var i in x) {
                w = x[i].getWidth(15) - 50;
                var boxWidth = (isMobileDevice) ? (dojo.window.getBox().w - 10) : (infoPopupWidth - 40);
                if (boxWidth < w) {
                    td1.className = "tdBreakWord";
                    continue;
                }
            }
        }

    }

    td1.innerHTML = value;
    tr.appendChild(td);
    tr.appendChild(td1);
}

//function to fetch comments for a service request
function FetchRequestComments(requestID) {
    dojo.byId('btnAddComments').disabled = false;
    selectedRequestID = requestID;
    var query = new esri.tasks.Query();
    query.where = "REQUESTID = '" + requestID + "'";
    query.outFields = ["*"];
    //execute query
    map.getLayer(serviceRequestCommentsLayerId).selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW, function (features) {
        var commentsTable = document.createElement("table");
        commentsTable.style.width = "95%";
        var commentsTBody = document.createElement("tbody");
        commentsTable.appendChild(commentsTBody);
        dojo.byId("divCommentsContent").appendChild(commentsTable);
        if (features.length > 0) {
            features.sort(SortResultFeatures);      //function to sort comments based on submitted date
            for (var i = 0; i < features.length; i++) {
                var trComments = document.createElement("tr");
                var commentsCell = document.createElement("td");
                commentsCell.className = "bottomborder";
                commentsCell.appendChild(CreateCommentRecord(features[i].attributes, i));
                trComments.appendChild(commentsCell);
                commentsTBody.appendChild(trComments);
                CreateRatingWidget(dojo.byId('commentRating' + i));
                SetRating(dojo.byId('commentRating' + i), features[i].attributes.RANK);
            }
            SetCommentHeight();
        }
        else {
            var trComments = document.createElement("tr");
            var commentsCell = document.createElement("td");
            commentsCell.appendChild(document.createTextNode("No comments available"));
            trComments.setAttribute("noComments", "true");
            trComments.appendChild(commentsCell);
            commentsTBody.appendChild(trComments);
        }
    }, function (err) {
    });
}

//function to fetch attachment details
function FetchAttachmentDetails(objectID, tbody) {
    RemoveScrollBar(dojo.byId("divCreateRequestContent"));
    map.getLayer(serviceRequestLayerId).queryAttachmentInfos(objectID, function (files) {
        var tr = document.createElement("tr");
        tbody.appendChild(tr);
        tr.vAlign = "top";
        var tdTitle = document.createElement("td");
        tdTitle.innerHTML = "Attachment: ";
        tdTitle.style.paddingTop = "5px";
        tr.appendChild(tdTitle);
        var tdAttachments = document.createElement("td");
        tdAttachments.style.paddingTop = "5px";
        tr.appendChild(tdAttachments);
        if (files.length == 0) {
            tdAttachments.innerHTML = "No attachment";
        }
        else {
            if (files[0].contentType.indexOf("image") >= 0) {
                var filePreview = dojo.create("img");
                filePreview.style.height = "130px";
                filePreview.style.width = "130px";
                filePreview.style.cursor = "pointer";
                filePreview.src = files[0].url;
                filePreview.onclick = function () {
                    window.open(files[0].url);
                }
                tdAttachments.appendChild(filePreview);
            }
            else {
                var filespan = document.createElement("span");
                filespan.innerHTML = files[0].name;
                filespan.className = 'spanFileDetails';
                tdAttachments.appendChild(filespan);
                filespan.onclick = function () {
                    window.open(files[0].url);
                }
            }
        }
        CreateScrollbar(dojo.byId("divInfoDetails"), dojo.byId("divInfoDetailsScroll"));
    });
}

//function to convert string to bool
String.prototype.bool = function () {
    return (/^true$/i).test(this);
};

//function to create Rating widget
function CreateRatingWidget(rating) {
    var numberStars = Number(rating.getAttribute("numstars"));
    var isReadOnly = String(rating.getAttribute("readonly")).bool();
    for (var i = 0; i < numberStars; i++) {
        var li = document.createElement("li");
        li.value = (i + 1);
        li.className = isReadOnly ? "ratingStar" : "ratingStarBig";
        rating.appendChild(li);
        if (i < rating.value) {
            dojo.addClass(li, isReadOnly ? "ratingStarChecked" : "ratingStarBigChecked");
        }
        li.onmouseover = function () {
            if (!isReadOnly) {
                var ratingValue = Number(this.value);
                var ratingStars = dojo.query(isReadOnly ? ".ratingStar" : ".ratingStarBig", rating);
                for (var i = 0; i < ratingValue; i++) {
                    dojo.addClass(ratingStars[i], isReadOnly ? "ratingStarChecked" : "ratingStarBigChecked");
                }
            }
        }
        li.onmouseout = function () {
            if (!isReadOnly) {
                var ratings = Number(rating.value);
                var ratingStars = dojo.query(isReadOnly ? ".ratingStar" : ".ratingStarBig", rating);
                for (var i = 0; i < ratingStars.length; i++) {
                    if (i < ratings) {
                        dojo.addClass(ratingStars[i], isReadOnly ? "ratingStarChecked" : "ratingStarBigChecked");
                    }
                    else {
                        dojo.removeClass(ratingStars[i], isReadOnly ? "ratingStarChecked" : "ratingStarBigChecked");
                    }
                }
            }
        }
        li.onclick = function () {
            if (!isReadOnly) {
                rating.value = Number(this.value);
                var ratingStars = dojo.query(isReadOnly ? ".ratingStar" : ".ratingStarBig", rating);
                for (var i = 0; i < ratingStars.length; i++) {
                    if (i < this.value) {
                        dojo.addClass(ratingStars[i], isReadOnly ? "ratingStarChecked" : "ratingStarBigChecked");
                    }
                    else {
                        dojo.removeClass(ratingStars[i], isReadOnly ? "ratingStarChecked" : "ratingStarBigChecked");
                    }
                }
            }
        }
    }
}

//function to set height for create request container
function SetCreateRequestHeight() {
    RemoveScrollBar(dojo.byId("divInfoDetails"));
    var height = (isMobileDevice) ? (dojo.window.getBox().h - 25) : dojo.coords(dojo.byId("divCreateRequestContainer")).h;
    dojo.byId('divCreateRequestScrollContent').style.height = (height - ((isBrowser) ? 105 : 125)) + "px";
    if (isMobileDevice) {
        dojo.byId('divCreateRequestScrollContent').style.height = (height - 90) + "px";
    }
    CreateScrollbar(dojo.byId("divCreateRequestContent"), dojo.byId("divCreateRequestScrollContent"));
}

//Set rating for rating control
function SetRating(control, rating) {
    control.value = rating;
    var isReadOnly = String(control.getAttribute("readonly")).bool();
    var ratingStars = dojo.query(isReadOnly ? ".ratingStar" : ".ratingStarBig", control);
    for (var i = 0; i < ratingStars.length; i++) {
        if (i < rating) {
            dojo.addClass(ratingStars[i], isReadOnly ? "ratingStarChecked" : "ratingStarBigChecked");
        }
        else {
            dojo.removeClass(ratingStars[i], isReadOnly ? "ratingStarChecked" : "ratingStarBigChecked");
        }
    }
}

//function to add comment
function AddRequestComment() {
    var text = dojo.byId('txtComments').value.trim('');
    if (text == "") {
        dojo.byId('txtComments').focus();
        ShowSpanErrorMessage('spanCommentError', messages.getElementsByTagName("enterComment")[0].childNodes[0].nodeValue);
        return;
    }
    if (dojo.byId('txtComments').value.length > 250) {
        dojo.byId('txtComments').focus();
        ShowSpanErrorMessage('spanCommentError', messages.getElementsByTagName("commentsLength")[0].childNodes[0].nodeValue);
        return;
    }
    ShowProgressIndicator();
    var commentGraphic = new esri.Graphic();
    var date = new js.date();
    var attr = {
        "REQUESTID": selectedRequestID,
        "COMMENTS": text,
        "SUBMITDT": date.utcMsFromTimestamp(date.localToUtc(date.localTimestampNow())),
        "RANK": Number(dojo.byId('commentRating').value)
    };
    commentGraphic.setAttributes(attr);
    dojo.byId('btnAddComments').disabled = true;
    map.getLayer(serviceRequestCommentsLayerId).applyEdits([commentGraphic], null, null, function (msg) {
        if (msg[0].error) {
        }
        else {
            var table = dojo.query('table', dojo.byId("divCommentsContent"));
            if (table.length > 0) {
                var x = dojo.query("tr[noComments = 'true']", table[0]);
                if (x.length > 0) {
                    RemoveChildren(table[0]);
                }
                var tr = table[0].insertRow(0);
                var commentsCell = document.createElement("td");
                commentsCell.className = "bottomborder";
                var index = dojo.query("tr", table[0]).length;
                if (index) {
                    index = 0;
                }
                commentsCell.appendChild(CreateCommentRecord(attr, index));
                tr.appendChild(commentsCell);
                CreateRatingWidget(dojo.byId('commentRating' + index));
                SetRating(dojo.byId('commentRating' + index), attr.RANK);
            }
        }
        dojo.byId('btnAddComments').disabled = false;
        ResetCommentValues();
        HideProgressIndicator();
        SetCommentHeight();
    }, function (err) {
        dojo.byId('btnAddComments').disabled = false;
        HideProgressIndicator();
    });
}

//function to create comment record
function CreateCommentRecord(attributes, i) {
    var table = document.createElement("table");
    table.style.width = "100%";
    var tbody = document.createElement("tbody");
    var tr = document.createElement("tr");
    tbody.appendChild(tr);
    var td3 = document.createElement("td");
    td3.align = "left";
    td3.appendChild(CreateRatingControl(true, "commentRating" + i, 0, 5));
    var trDate = document.createElement("tr");
    tbody.appendChild(trDate);
    var td1 = document.createElement("td");
    var utcMilliseconds = Number(attributes.SUBMITDT);
    var date = new js.date();
    td1.innerHTML = "Date: " + dojo.date.locale.format(date.utcToLocal(date.utcTimestampFromMs(utcMilliseconds)), { datePattern: formatDateAs, selector: "date" });
    td1.align = "left";
    td1.colSpan = 2;
    tr.appendChild(td3);
    trDate.appendChild(td1);
    var tr1 = document.createElement("tr");
    var td2 = document.createElement("td");
    td2.colSpan = 2;
    td2.id = "tdComment";
    if (isMobileDevice) {
        td2.style.width = "100%";
    }
    else {
        td2.style.width = (infoPopupWidth - 40) + "px";
    }
    td2.colSpan = 2;
    if (attributes.COMMENTS) {
        var wordCount = attributes.COMMENTS.split(/\n/).length;
        if (wordCount > 1) {
            var value = attributes.COMMENTS.split(/\n/)[0].length == 0 ? "<br>" : attributes.COMMENTS.split(/\n/)[0].trim();
            for (var c = 1; c < wordCount; c++) {
                var comment;
                if (value != "<br>") {
                    comment = attributes.COMMENTS.split(/\n/)[c].trim().replace("", "<br>");
                }
                else {
                    comment = attributes.COMMENTS.split(/\n/)[c].trim();
                }
                value += attributes.COMMENTS.split(/\n/)[c].length == 0 ? "<br>" : comment;
            }
        }
        else {
            value = attributes.COMMENTS;
        }
        td2.innerHTML += value;
        if (CheckMailFormat(attributes.COMMENTS) || dojo.string.substitute(attributes.COMMENTS).match("http:" || "https:")) {
            td2.className = "tdBreakWord";
        }
        else {
            td2.className = "tdBreak";
        }
        var x = attributes.COMMENTS.split(" ");
        for (var i in x) {
            w = x[i].getWidth(15) - 50;
            var boxWidth = (isMobileDevice) ? (dojo.window.getBox().w - 10) : (infoPopupWidth - 40);
            if (boxWidth < w) {
                td2.className = "tdBreakWord";
                continue;
            }
        }
    }
    else {
        td2.innerHTML = showNullValueAs;
    }
    tr1.appendChild(td2);
    tbody.appendChild(tr1);
    table.appendChild(tbody);
    return table;
}

//Function to append ... for a string
String.prototype.trimString = function (len) {
    return (this.length > len) ? this.substring(0, len) + "..." : this;
}

//function to reset comments data
function ResetCommentValues() {
    dojo.byId('txtComments').value = '';
    SetRating(dojo.byId('commentRating'), 0);
    document.getElementById('spanCommentError').innerHTML = "";
    document.getElementById('spanCommentError').style.display = 'none';
    dojo.byId('divAddComment').style.display = "none";
    dojo.byId('divCommentsView').style.display = "block";
    dojo.byId('divCommentsList').style.display = "block";
}

//function to create rating control
function CreateRatingControl(readonly, ctlId, intitalValue, numStars) {
    var ratingCtl = document.createElement("ul");
    ratingCtl.setAttribute("readonly", readonly);
    ratingCtl.id = ctlId;
    ratingCtl.setAttribute("value", intitalValue);
    ratingCtl.setAttribute("numStars", numStars);
    ratingCtl.style.padding = 0;
    ratingCtl.style.margin = 0;
    return ratingCtl;
}

//function to show service request container
function ShowServiceRequestContainer() {
    dojo.byId('divInfoContainer').style.display = "block";
    dojo.byId("divInfoDetails").style.display = "block";
    dojo.replaceClass("divInfoContent", "showContainer", "hideContainer");
}

//function to create scroll-bar
function CreateScrollbar(container, content) {
    var yMax;
    var pxLeft, pxTop, xCoord, yCoord;
    var scrollbar_track;
    var isHandleClicked = false;
    this.container = container;
    this.content = content;
    content.scrollTop = 0;
    if (dojo.byId(container.id + 'scrollbar_track')) {
        RemoveChildren(dojo.byId(container.id + 'scrollbar_track'));
        container.removeChild(dojo.byId(container.id + 'scrollbar_track'));
    }
    if (!dojo.byId(container.id + 'scrollbar_track')) {
        scrollbar_track = document.createElement('div');
        scrollbar_track.id = container.id + "scrollbar_track";
        scrollbar_track.className = "scrollbar_track";
    }
    else {
        scrollbar_track = dojo.byId(container.id + 'scrollbar_track');
    }
    var containerHeight = dojo.coords(container);
    scrollbar_track.style.right = 5 + 'px';
    var scrollbar_handle = document.createElement('div');
    scrollbar_handle.className = 'scrollbar_handle';
    scrollbar_handle.id = container.id + "scrollbar_handle";
    scrollbar_track.appendChild(scrollbar_handle);
    container.appendChild(scrollbar_track);
    if ((content.scrollHeight - content.offsetHeight) <= 5) {
        scrollbar_handle.style.display = 'none';
        scrollbar_track.style.display = 'none';
        return;
    }
    else {
        if (isBrowser) {
            if ((dojo.byId("divCreateRequestContainer").style.display) == "block") {
                dojo.byId("divCreateRequestContentscrollbar_track").style.top = "35px";
            }
        }
        scrollbar_handle.style.display = 'block';
        scrollbar_track.style.display = 'block';
        scrollbar_handle.style.height = Math.max(this.content.offsetHeight * (this.content.offsetHeight / this.content.scrollHeight), 25) + 'px';
        yMax = this.content.offsetHeight - scrollbar_handle.offsetHeight;
        yMax = yMax - 5; //for getting rounded bottom of handle
        if (window.addEventListener) {
            content.addEventListener('DOMMouseScroll', ScrollDiv, false);
        }
        content.onmousewheel = function (evt) {
            console.log(content.id);
            ScrollDiv(evt);
        }
    }

    //Function for scrolling the mouse event
    function ScrollDiv(evt) {
        var evt = window.event || evt //equalize event object
        var delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta //delta returns +120 when wheel is scrolled up, -120 when scrolled down
        pxTop = scrollbar_handle.offsetTop;

        if (delta <= -120) {
            var y = pxTop + 10;
            if (y > yMax) y = yMax // Limit vertical movement
            if (y < 0) y = 0 // Limit vertical movement
            scrollbar_handle.style.top = y + "px";
            content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));

        }
        else {
            var y = pxTop - 10;
            if (y > yMax) y = yMax // Limit vertical movement
            if (y < 0) y = 2 // Limit vertical movement
            scrollbar_handle.style.top = (y - 2) + "px";
            content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
        }
    }

    //Attaching events to scrollbar components
    scrollbar_track.onclick = function (evt) {
        if (!isHandleClicked) {
            evt = (evt) ? evt : event;
            pxTop = scrollbar_handle.offsetTop // Sliders vertical position at start of slide.
            var offsetY;
            if (!evt.offsetY) {
                var coords = dojo.coords(evt.target);
                offsetY = evt.layerY - coords.t;
            }
            else
                offsetY = evt.offsetY;
            if (offsetY < scrollbar_handle.offsetTop) {
                scrollbar_handle.style.top = offsetY + "px";
                content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
            }
            else if (offsetY > (scrollbar_handle.offsetTop + scrollbar_handle.clientHeight)) {
                var y = offsetY - scrollbar_handle.clientHeight;
                if (y > yMax) y = yMax // Limit vertical movement
                if (y < 0) y = 0 // Limit vertical movement
                scrollbar_handle.style.top = y + "px";
                content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
            }
            else {
                return;
            }
        }
        isHandleClicked = false;
    };

    //Attaching events to scrollbar components
    scrollbar_handle.onmousedown = function (evt) {
        isHandleClicked = true;
        evt = (evt) ? evt : event;
        evt.cancelBubble = true;
        if (evt.stopPropagation) evt.stopPropagation();
        pxTop = scrollbar_handle.offsetTop // Sliders vertical position at start of slide.
        yCoord = evt.screenY // Vertical mouse position at start of slide.
        document.body.style.MozUserSelect = 'none';
        document.body.style.userSelect = 'none';
        document.onselectstart = function () {
            return false;
        }
        document.onmousemove = function (evt) {
            evt = (evt) ? evt : event;
            evt.cancelBubble = true;
            if (evt.stopPropagation) evt.stopPropagation();
            var y = pxTop + evt.screenY - yCoord;
            if (y > yMax) y = yMax // Limit vertical movement
            if (y < 0) y = 0 // Limit vertical movement
            scrollbar_handle.style.top = y + "px";
            content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
        }
    };

    document.onmouseup = function () {
        document.body.onselectstart = null;
        document.onmousemove = null;
    };

    scrollbar_handle.onmouseout = function (evt) {
        document.body.onselectstart = null;
    };

    var startPos;
    var scrollingTimer;

    dojo.connect(container, "touchstart", function (evt) {
        touchStartHandler(evt);
    });

    dojo.connect(container, "touchmove", function (evt) {
        touchMoveHandler(evt);
    });

    dojo.connect(container, "touchend", function (evt) {
        touchEndHandler(evt);
    });

    //Handlers for Touch Events
    function touchStartHandler(e) {
        startPos = e.touches[0].pageY;
    }

    function touchMoveHandler(e) {
        BlurTextIsos();
        var touch = e.touches[0];
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
        e.preventDefault();

        pxTop = scrollbar_handle.offsetTop;
        var y;
        if (startPos > touch.pageY) {
            y = pxTop + 10;
        }
        else {
            y = pxTop - 10;
        }

        //setting scrollbar handle
        if (y > yMax) y = yMax // Limit vertical movement
        if (y < 0) y = 0 // Limit vertical movement
        scrollbar_handle.style.top = y + "px";

        //setting content position
        content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));

        scrolling = true;
        startPos = touch.pageY;
    }

    function touchEndHandler(e) {
        scrollingTimer = setTimeout(function () { clearTimeout(scrollingTimer); scrolling = false; }, 100);
    }
    //touch scrollbar end
}

//function used to trim the string
String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); }

//function to make the text fields blur on scroll
function BlurTextIsos() {
    dojo.byId("txtDescription").blur();
    dojo.byId("txtName").blur();
    dojo.byId("txtPhone").blur();
    dojo.byId("txtMail").blur();

}
//function to show error message span
function ShowSpanErrorMessage(controlId, message) {
    dojo.byId(controlId).style.display = "block";
    dojo.byId(controlId).innerHTML = message;
}

//Function to get width of a control when text and font size are specified
String.prototype.getWidth = function (fontSize) {
    var test = document.createElement("span");
    document.body.appendChild(test);
    test.style.visibility = "hidden";
    test.style.fontSize = fontSize + "px";
    test.innerHTML = this;
    var w = test.offsetWidth;
    document.body.removeChild(test);
    return w;
}

//function to hide upload file dialog for iOS devices
function CloseUploadDialog() {
    dojo.byId('divUploadDialogContainer').style.display = 'none';
}

//Function for sorting comments according to date
function SortResultFeatures(a, b) {
    var x = a.attributes.SUBMITDT;
    var y = b.attributes.SUBMITDT;
    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
}

//function to create new service request
function SubmitIssueDetails() {
    dojo.byId('txtPhone').value = dojo.byId('txtPhone').value.trim('');
    dojo.byId('txtMail').value = dojo.byId('txtMail').value.trim('');
    dojo.byId('txtName').value = dojo.byId('txtName').value.trim('');
    if (!ValidateRequestData()) {
        return;
    }

    dojo.byId('spanServiceErrorMessage').innerHTML = "";
    ShowProgressIndicator('map');
    var mapPoint = map.getLayer(tempGraphicsLayerId).graphics[0].geometry;
    var date = new js.date();
    var serviceRequestAttributes = {
        "REQUESTTYPE": dojo.byId("txtSelectedRequest").value,
        "COMMENTS": dojo.byId('txtDescription').value.trim(),
        "NAME": dojo.byId('txtName').value.trim(),
        "PHONE": dojo.byId('txtPhone').value,
        "EMAIL": dojo.byId('txtMail').value.trim(),
        "STATUS": "Unassigned",
        "REQUESTDATE": date.utcMsFromTimestamp(date.localToUtc(date.localTimestampNow()))
    };
    var serviceRequestGraphic = new esri.Graphic(mapPoint, null, serviceRequestAttributes, null);
    map.getLayer(serviceRequestLayerId).applyEdits([serviceRequestGraphic], null, null, function (addResults) {
        if (addResults[0].success) {
            var objectIdField = map.getLayer(serviceRequestLayerId).objectIdField;
            var requestID = { "REQUESTID": String(addResults[0].objectId) };
            requestID[objectIdField] = addResults[0].objectId;
            var requestGraphic = new esri.Graphic(mapPoint, null, requestID, null);
            map.getLayer(serviceRequestLayerId).applyEdits(null, [requestGraphic], null, function () {
                serviceRequestGraphic.attributes["REQUESTID"] = String(addResults[0].objectId);
                if (dojo.byId('txtFileName').value != "") {
                    map.getLayer(serviceRequestLayerId).addAttachment(addResults[0].objectId, dojo.byId('formFileUplaod'), function (sucess) {
                        ShowServiceRequestDetails(mapPoint, serviceRequestGraphic.attributes);
                        HideProgressIndicator();
                        ResetRequestFields();
                        HideCreateRequestContainer();
                    }, function (err) {
                        HideProgressIndicator();
                        alert(messages.getElementsByTagName("fileSize")[0].childNodes[0].nodeValue);
                    });

                }
                else {
                    ShowServiceRequestDetails(mapPoint, serviceRequestGraphic.attributes);
                    HideProgressIndicator();
                    ResetRequestFields();
                    HideCreateRequestContainer();
                }
                if (isiOS) {
                    if (enablePhotoUploadiOS) {
                        dojo.byId('divUploadDialogContainer').style.display = 'block';
                        var attachmentURL = serviceRequestLayerUrl.ServiceURL + "/${0}/addAttachment";
                        var postURL = dojo.string.substitute(attachmentURL, [addResults[0].objectId]);
                        var currentParams = {
                            'callbackURL': escape(window.location),
                            'posturl': escape(postURL),
                            'debug': 'true',
                            'referrername': escape('Service request'),
                            'purpose': escape('Upload Photo')
                        };
                        Picup.convertFileInput('btnAddPhoto', currentParams);
                    }
                }
            }, function (err) {

                HideProgressIndicator();
                ShowSpanErrorMessage("spanServiceErrorMessage", "Unable to create service request.");

            });
        }
    }, function (err) {
        HideProgressIndicator();
        ShowSpanErrorMessage("spanServiceErrorMessage", "Unable to create service request.");

    });
}

//function to validate service request data
function ValidateRequestData() {
    if (dojo.byId("txtSelectedRequest").value.trim() == "") {
        ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("selectRequestType")[0].childNodes[0].nodeValue);
        return false;
    }
    if (dojo.byId('txtDescription').value.trim().length > 0 && dojo.byId('txtDescription').value.trim().length > 250) {
        dojo.byId('txtDescription').focus();
        ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("commentsLength")[0].childNodes[0].nodeValue);
        return false;
    }
    if (dojo.byId('txtName').value.length > 0) {
        if (!IsName(dojo.byId('txtName').value.trim())) {
            dojo.byId('txtName').focus();
            ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("nameProvisions")[0].childNodes[0].nodeValue);
            return false;
        }
    }
    if (dojo.byId('txtMail').value == '' && dojo.byId('txtPhone').value == '') {
        ShowSpanErrorMessage("spanServiceErrorMessage", "Email or Phone number is required.");
        return;
    }
    if (dojo.byId('txtPhone').value == '') {
        if (!CheckMailFormat(dojo.byId('txtMail').value)) {
            dojo.byId('txtMail').focus();
            ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("enterValidEmailId")[0].childNodes[0].nodeValue);
            return false;
        }
    }
    else if (dojo.byId('txtMail').value == '') {
        if (!IsPhoneNumber(dojo.byId('txtPhone').value.trim())) {
            dojo.byId('txtPhone').focus();
            ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("enterValidPhone")[0].childNodes[0].nodeValue);
            return false;
        }
        if (dojo.byId('txtPhone').value.length < 10 || dojo.byId('txtPhone').value.length > 10) {
            dojo.byId('txtPhone').focus();
            ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("enterValidPhone")[0].childNodes[0].nodeValue);
            return false;
        }
    }
    if (dojo.byId('txtPhone').value.length > 0) {
        if (!IsPhoneNumber(dojo.byId('txtPhone').value.trim())) {
            dojo.byId('txtPhone').focus();
            ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("enterValidPhone")[0].childNodes[0].nodeValue);
            return false;
        }
    }
    if (dojo.byId('txtPhone').value.length > 10) {
        dojo.byId('txtPhone').focus();
        ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("enterValidPhone")[0].childNodes[0].nodeValue);
        return false;
    }
    if (dojo.byId('txtMail').value.length > 0) {
        if (!CheckMailFormat(dojo.byId('txtMail').value)) {
            dojo.byId('txtMail').focus();
            ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("enterValidEmailId")[0].childNodes[0].nodeValue);
            return false;
        }
        if (dojo.byId('txtMail').value.length > 100) {
            dojo.byId('txtMail').focus();
            ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("emailIdLength")[0].childNodes[0].nodeValue);
            return false;
        }
        if (dojo.byId('txtPhone').value.length > 10) {
            dojo.byId('txtPhone').focus();
            ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("enterValidPhone")[0].childNodes[0].nodeValue);
            return false;
        }
    }
    return true;
}

//function to validate name
function IsName(name) {
    var namePattern = /^[A-Za-z\.\- ]{1,150}$/;
    if (namePattern.test(name)) {
        return true;
    } else {
        return false;
    }
}

//function to validate 10 digit number
function IsPhoneNumber(value) {
    var namePattern = /\d{10}/;
    if (namePattern.test(value)) {
        return true;
    } else {
        return false;
    }
}

//function to hide create request container
function HideCreateRequestContainer() {
    selectedMapPoint = null;
    map.getLayer(tempGraphicsLayerId).clear();
    map.infoWindow.hide();
    if (isMobileDevice) {
        setTimeout(function () {
            dojo.byId('divCreateRequest').style.display = "none";
            dojo.replaceClass("divCreateRequest", "opacityShowAnimation", "opacityHideAnimation");
            dojo.replaceClass("divCreateRequestContainer", "hideContainer", "showContainer");
        }, 500);
    }
    else {
        dojo.byId('divCreateRequestContainer').style.display = "none";
        dojo.byId("divCreateRequestContent").style.display = "none";
    }
}

//function to hide upload file dialog for iOS devices
function CloseUploadDialog() {
    dojo.byId('divUploadDialogContainer').style.display = 'none';
}

//function to populate filename
function SetFileName(fileUploadCtl) {
    if (fileUploadCtl.value.lastIndexOf("\\") > 0) {
        dojo.byId('txtFileName').value = fileUploadCtl.value.substring(fileUploadCtl.value.lastIndexOf("\\") + 1);
    }
    else {
        dojo.byId('txtFileName').value = fileUploadCtl.value;
    }
}

//function for displaying the current location of the user
function ShowMyLocation() {
    HideBaseMapLayerContainer();
    HideShareAppContainer();
    HideAddressContainer();
    navigator.geolocation.getCurrentPosition(
		function (position) {
		    ShowProgressIndicator();
		    mapPoint = new esri.geometry.Point(position.coords.longitude, position.coords.latitude, new esri.SpatialReference({ wkid: 4326 }));
		    var graphicCollection = new esri.geometry.Multipoint(new esri.SpatialReference({ wkid: 4326 }));
		    graphicCollection.addPoint(mapPoint);
		    geometryService.project([graphicCollection], map.spatialReference, function (newPointCollection) {
		        for (var bMap = 0; bMap < baseMapLayers.length; bMap++) {
		            if (map.getLayer(baseMapLayers[bMap].Key).visible) {
		                var bmap = baseMapLayers[bMap].Key;
		            }
		        }
		        if (!map.getLayer(bmap).fullExtent.contains(newPointCollection[0].getPoint(0))) {
		            mapPoint = null;
		            selectedMapPoint = null;
		            map.getLayer(tempGraphicsLayerId).clear();
		            map.infoWindow.hide();
		            HideProgressIndicator();
		            alert(messages.getElementsByTagName("geoLocation")[0].childNodes[0].nodeValue);
		            return;
		        }
		        mapPoint = newPointCollection[0].getPoint(0);
		        var ext = GetExtent(mapPoint);
		        map.setExtent(ext.getExtent().expand(2));
		        var graphic = new esri.Graphic(mapPoint, locatorMarkupSymbol, { "Locator": true }, null);
		        map.getLayer(tempGraphicsLayerId).add(graphic);

		        HideProgressIndicator();
		    });
		},
          	function (error) {
          	    HideProgressIndicator();
          	    switch (error.code) {
          	        case error.TIMEOUT:
          	            alert(messages.getElementsByTagName("geolocationTimeout")[0].childNodes[0].nodeValue);
          	            break;
          	        case error.POSITION_UNAVAILABLE:
          	            alert(messages.getElementsByTagName("geolocationPositionUnavailable")[0].childNodes[0].nodeValue);
          	            break;
          	        case error.PERMISSION_DENIED:
          	            alert(messages.getElementsByTagName("geolocationPermissionDenied")[0].childNodes[0].nodeValue);
          	            break;
          	        case error.UNKNOWN_ERROR:
          	            alert(messages.getElementsByTagName("geolocationUnKnownError")[0].childNodes[0].nodeValue);
          	            break;
          	    }
          	}, { timeout: 10000 }
       );
}

//function to handle orientation change event handler
function OrientationChanged() {
    orientationChange = true;
    if (map) {
        var timeout = (isMobileDevice && isiOS) ? 100 : 500;
        map.infoWindow.hide();
        setTimeout(function () {
            if (isMobileDevice) {
                map.reposition();
                map.resize();
                SetAddressResultsHeight();
                SetCommentHeight();
                SetSplashScreenHeight();
                dojo.byId("divRequestTypes").style.width = (dojo.coords("divDropdown").w - 2) + "px";
                SetCreateRequestHeight();
                SetViewDetailsHeight();
                SetCmtControlsHeight();
                setTimeout(function () {
                    if (selectedMapPoint) {
                        map.setExtent(GetMobileMapExtent(selectedMapPoint));
                    }
                    orientationChange = false;
                    return;
                }, 1000);
            }
            else {
                setTimeout(function () {
                    if (selectedMapPoint) {
                        map.setExtent(GetBrowserMapExtent(selectedMapPoint));
                    }
                    orientationChange = false;
                }, 100);
            }
        }, timeout);
    }
}

//function to hide splash screen container
function HideSplashScreenMessage() {
    if (dojo.isIE < 9) {
        dojo.byId("divSplashScreenContent").style.display = "none";
    }
    dojo.addClass('divSplashScreenContainer', "opacityHideAnimation");
    dojo.replaceClass("divSplashScreenContent", "hideContainer", "showContainer");
}

//function to set height for splash screen
function SetSplashScreenHeight() {
    var height = (isMobileDevice) ? (dojo.window.getBox().h - 110) : (dojo.coords(dojo.byId('divSplashScreenContent')).h - 80);
    dojo.byId('divSplashContent').style.height = (height + 14) + "px";
    CreateScrollbar(dojo.byId("divSplashContainer"), dojo.byId("divSplashContent"));
}

//function to handle resize browser event handler
function ResizeHandler() {
    if (map) {
        map.reposition();
        map.resize();
    }
}

//function to show address container
function ShowLocateContainer() {
    dojo.byId('txtAddress').blur();
    HideBaseMapLayerContainer();
    HideShareAppContainer();
    if (isMobileDevice) {
        dojo.byId('divAddressContainer').style.display = "block";
        dojo.replaceClass("divAddressContent", "showContainer", "hideContainer");
        dojo.byId("txtAddress").value = dojo.byId("txtAddress").getAttribute("defaultAddress");
    }
    else {
        if (dojo.coords("divAddressContent").h > 0) {
            HideAddressContainer();
            dojo.byId('txtAddress').blur();
        }
        else {
            dojo.byId('divAddressContent').style.height = "300px";
            dojo.replaceClass("divAddressContent", "showContainerHeight", "hideContainerHeight");
            setTimeout(function () {
                dojo.byId('txtAddress').focus();
            }, 500);
        }
    }
    RemoveChildren(dojo.byId('tblAddressResults'));
    SetAddressResultsHeight();
}

//function to hide address container
function HideAddressContainer() {
    if (isMobileDevice) {
        setTimeout(function () {
            dojo.byId('divAddressContainer').style.display = "none";
        }, 500);
        dojo.replaceClass("divAddressContent", "hideContainerHeight", "showContainerHeight");
    }
    else {
        dojo.replaceClass("divAddressContent", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divAddressContent').style.height = '0px';
    }
}

//function to set height and create scrollbar for address results
function SetAddressResultsHeight() {
    var height = (isMobileDevice) ? (dojo.window.getBox().h - 50) : dojo.coords(dojo.byId('divAddressContent')).h;
    if (height > 0) {
        dojo.byId('divAddressScrollContent').style.height = (height - ((!isTablet) ? 100 : 120)) + "px";
    }
    CreateScrollbar(dojo.byId("divAddressScrollContainer"), dojo.byId("divAddressScrollContent"));
}

//function to hide Info request container
function HideInfoContainer() {
    selectedMapPoint = null;
    if (isMobileDevice) {
        setTimeout(function () {
            dojo.byId('divInfoContainer').style.display = "none";
            dojo.replaceClass("divInfoContent", "hideContainer", "showContainer");
        }, 500);
    }
    else {
        map.infoWindow.hide();
        dojo.byId('divInfoContent').style.display = "none";
        dojo.byId("divInfoDetails").style.display = "none";
    }
}

//function to set height for view details
function SetViewDetailsHeight() {
    var height = (isMobileDevice) ? (dojo.window.getBox().h) : dojo.coords(dojo.byId('divInfoContent')).h;
    if (height > 0) {
        dojo.byId('divInfoDetailsScroll').style.height = (height - ((!isTablet) ? 55 : 55)) + "px";
    }
    CreateScrollbar(dojo.byId("divInfoDetails"), dojo.byId("divInfoDetailsScroll"));

}

//function to set height and create scroll bar for comments
function SetCommentHeight() {
    var height = (isMobileDevice) ? (dojo.window.getBox().h) : (dojo.coords(dojo.byId('divInfoContent')).h - 10);
    if (height > 0) {
        dojo.byId('divCommentsContent').style.height = (height - ((isBrowser) ? 120 : 150)) + "px";
    }
    CreateScrollbar(dojo.byId("divCommentsContainer"), dojo.byId("divCommentsContent"));
    if (isMobileDevice) {
        dojo.byId('divInfoComments').style.width = dojo.window.getBox().w - 15 + "px";
    }
}

//function to show Info request directions view
function ShowInfoDirectionsView() {
    if (dojo.byId('imgDirections').getAttribute("disp") == "Details") {
        dojo.byId('imgComments').src = "images/comments.png";
        dojo.byId('imgComments').title = "Comments";
        dojo.byId('imgComments').setAttribute("disp", "Comments");
        dojo.byId('divInfoComments').style.display = "none";
        dojo.byId('divInfoDetails').style.display = "block";
        dojo.byId('imgDirections').style.display = "none";
        dojo.byId('imgComments').style.display = "block";
        SetViewDetailsHeight();
    }
}

//function to get the extent based on the map point
function GetBrowserMapExtent(mapPoint) {
    var width = map.extent.getWidth();
    var height = map.extent.getHeight();
    var xmin = mapPoint.x - (width / 2);
    var ymin = mapPoint.y - (height / 3);
    var xmax = xmin + width;
    var ymax = ymin + height;
    return new esri.geometry.Extent(xmin, ymin, xmax, ymax, map.spatialReference);
}

//function to get the extent based on the map point
function GetMobileMapExtent(mapPoint) {
    var width = map.extent.getWidth();
    var height = map.extent.getHeight();
    var xmin = mapPoint.x - (width / 2);
    var ymin = mapPoint.y - (height / 4);
    var xmax = xmin + width;
    var ymax = ymin + height;
    return new esri.geometry.Extent(xmin, ymin, xmax, ymax, map.spatialReference);
}

//function to show add comments view
function ShowAddCommentsView() {
    dojo.byId('divAddComment').style.display = "block";
    dojo.byId('divCommentsView').style.display = "none";
    dojo.byId('divCommentsList').style.display = "none";
    SetCmtControlsHeight();
    setTimeout(function () {
        dojo.byId('txtComments').focus();
    }, 50);
}

//function to populate request type data
function CreateRequestTypesList(serviceRequestLayerFields) {
    var serviceRequestFields;
    for (var i = 0; i < serviceRequestLayerFields.length; i++) {
        if (serviceRequestLayerFields[i].name == "REQUESTTYPE") {
            serviceRequestFields = serviceRequestLayerFields[i].domain.codedValues;
            break;
        }
    }
    if (!isMobileDevice) {
        dojo.byId('divCreateRequestContainer').style.width = infoPopupWidth + "px";
        dojo.byId('divCreateRequestContainer').style.height = infoPopupHeight + "px";
    }
    var table = document.createElement("table");
    var tBody = document.createElement("tbody");
    table.appendChild(tBody);
    table.cellSpacing = 0;
    table.cellPadding = 0;
    for (var i = 0; i < serviceRequestFields.length; i++) {
        var tr = document.createElement("tr");
        tBody.appendChild(tr);
        var td = document.createElement("td");
        td.style.height = "20px";
        td.style.paddingLeft = "5px";
        td.align = "left";
        td.style.cursor = "pointer";
        td.style.fontFamily = "Verdana";
        td.innerHTML = serviceRequestFields[i].name;
        td.onclick = function () {
            dojo.byId('txtSelectedRequest').value = this.innerHTML;
            dojo.byId('divRequestTypes').style.display = "none";
            dojo.byId("divCreateRequestContentscrollbar_handle").style.position = "relative";
        }
        tr.appendChild(td);
    }
    var scrollbar_container = document.createElement('div');
    scrollbar_container.id = "divScrollBarContainer";
    scrollbar_container.className = "scrollbar_container";
    var container = document.createElement("div");
    container.id = "divScrollBarContent";
    container.className = 'scrollbar_content';
    container.appendChild(table);
    scrollbar_container.appendChild(container);
    dojo.byId('divRequestTypes').appendChild(scrollbar_container);
}

//function to show comments controls with scrollbar
function SetCmtControlsHeight() {
    var height = (isMobileDevice) ? (dojo.window.getBox().h - 20) : dojo.coords(dojo.byId('divInfoContent')).h;
    dojo.byId("divCmtIpContainer").style.height = (height - ((isTablet) ? 100 : 80)) + "px";
    dojo.byId('divCmtIpContent').style.height = (height - ((isTablet) ? 100 : 80)) + "px";
    CreateScrollbar(dojo.byId("divCmtIpContainer"), dojo.byId("divCmtIpContent"));
}

//function to reset map position
function SetMapTipPosition() {
    if (!orientationChange) {
        if (map.getLayer(tempGraphicsLayerId)) {
            if (map.getLayer(tempGraphicsLayerId).graphics.length > 0) {
                if (map.getLayer(tempGraphicsLayerId).graphics[0].attributes) {
                    return;
                }
                mapPoint = map.getLayer(tempGraphicsLayerId).graphics[0].geometry;
                var screenPoint = map.toScreen(mapPoint);
                screenPoint.y = map.height - screenPoint.y;
                map.infoWindow.setLocation(screenPoint);
                return;
            }
            if (selectedMapPoint) {
                var screenPoint = map.toScreen(selectedMapPoint);
                screenPoint.y = map.height - screenPoint.y;
                map.infoWindow.setLocation(screenPoint);
            }
        }
    }
}

//Function to hide the base map container
function HideBaseMapLayerContainer() {
    dojo.replaceClass("divLayerContainer", "hideContainerHeight", "showContainerHeight");
    dojo.byId('divLayerContainer').style.height = '0px';
}

//Function to hide the share link container
function HideShareAppContainer() {
    dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
    dojo.byId('divAppContainer').style.height = '0px';
}

//Function to open login page for facebook,tweet,email
function ShareLink(ext) {
    tinyUrl = null;
    mapExtent = GetMapExtent();
    var url = esri.urlToObject(windowURL);
    var urlStr = encodeURI(url.path) + "?extent=" + mapExtent;
    url = dojo.string.substitute(mapSharingOptions.TinyURLServiceURL, [urlStr]);

    dojo.io.script.get({
        url: url,
        callbackParamName: "callback",
        load: function (data) {
            tinyResponse = data;
            tinyUrl = data;
            var attr = mapSharingOptions.TinyURLResponseAttribute.split(".");
            for (var x = 0; x < attr.length; x++) {
                tinyUrl = tinyUrl[attr[x]];
            }
            if (ext) {
                HideBaseMapLayerContainer();
                HideAddressContainer();
                var cellHeight = (isMobileDevice || isTablet) ? 81 : 60;

                if (dojo.coords("divAppContainer").h > 0) {
                    HideShareAppContainer();
                }
                else {
                    dojo.byId('divAppContainer').style.height = cellHeight + "px";
                    dojo.replaceClass("divAppContainer", "showContainerHeight", "hideContainerHeight");
                }
            }
        },
        error: function (error) {
            alert(tinyResponse.error);
        }
    });
    setTimeout(function () {
        if (!tinyResponse) {
            alert(messages.getElementsByTagName("tinyURLEngine")[0].childNodes[0].nodeValue);
            return;
        }
    }, 6000);
}

//Function to open login page for facebook,tweet,email
function Share(site) {
    if (dojo.coords("divAppContainer").h > 0) {
        dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divAppContainer').style.height = '0px';
    }
    if (tinyUrl) {
        switch (site) {
            case "facebook":
                window.open(dojo.string.substitute(mapSharingOptions.FacebookShareURL, [tinyUrl]));
                break;
            case "twitter":
                window.open(dojo.string.substitute(mapSharingOptions.TwitterShareURL, [tinyUrl]));
                break;
            case "mail":
                parent.location = dojo.string.substitute(mapSharingOptions.ShareByMailLink, [tinyUrl]);
                break;
        }
    }
    else {
        alert(messages.getElementsByTagName("tinyURLEngine")[0].childNodes[0].nodeValue);
        return;
    }
}

//Function to get map Extent
function GetMapExtent() {
    var extents = map.extent.xmin.toString() + ",";
    extents += map.extent.ymin.toString() + ",";
    extents += map.extent.xmax.toString() + ",";
    extents += map.extent.ymax.toString();
    return (extents);
}

//Function to get the query string value of the provided key if not found the function returns empty string
function GetQuerystring(key) {
    var _default;
    if (_default == null) _default = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if (qs == null)
        return _default;
    else
        return qs[1];
}

//function to restrict the maximum no of characters in the text area control
function ImposeMaxLength(Object, MaxLen) {
    return (Object.value.length <= MaxLen);
}

//function to show progress indicator
function ShowProgressIndicator() {
    dojo.byId('divLoadingIndicator').style.display = "block";
}

//function to hide progress indicator
function HideProgressIndicator() {
    dojo.byId('divLoadingIndicator').style.display = "none";
}

//Function for validating Email in comments tab
function CheckMailFormat(emailValue) {
    var pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i
    if (pattern.test(emailValue)) {
        return true;
    }
    else {
        return false;
    }
}






