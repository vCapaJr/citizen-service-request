/** @license
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
dojo.provide("js.config");
dojo.declare("js.config", null, {

    // This file contains various configuration settings for "Service Request" template
    //
    // Use this file to perform the following:
    //
    // 1.  Specify application Name                   - [ Tag(s) to look for: ApplicationName ]
    // 2.  Set path for application icon              - [ Tag(s) to look for: ApplicationIcon ]
    // 3.  Set splash screen message                  - [ Tag(s) to look for: SplashScreenMessage ]
    // 4.  Set URL for help page                      - [ Tag(s) to look for: HelpURL ]
    // 5.  Specify URLs for base maps                  - [ Tag(s) to look for: BaseMapLayers ]
    // 6.  Set initial map extent                     - [ Tag(s) to look for: DefaultExtent ]
    // 7.  Or for using map services:
    // 7a. Specify URLs for operational layers        - [ Tag(s) to look for: serviceRequestLayerURL, serviceRequestmobileLayerURL, serviceRequestCommentsLayerURL ]
    // 7b. Customize info-Window settings             - [ Tag(s) to look for: InfoWindowHeader, InfoWindowContent ]
    // 7c. Customize info-Popup settings              - [ Tag(s) to look for: infoWindowData, ShowCommentsTab ]
    // 7d. Customize info-Popup size                  - [ Tag(s) to look for: InfoPopupHeight, InfoPopupWidth ]
    // 7e. Customize data formatting                  - [ Tag(s) to look for: ShowNullValueAs, FormatDateAs ]
    // 8. Customize address search settings           - [ Tag(s) to look for: LocatorURL, LocatorFields, LocatorDefaultAddress, LocatorMarkupSymbolPath]
    // 9. Set URL for geometry service                - [ Tag(s) to look for: GeometryService ]
    // 10.Set for uploading images into iOS devices   - [ Tag(s) to look for: enablePhotoUploadiOS,photoUploadText ]
    // 11. Specify URLs for map sharing               - [ Tag(s) to look for: FacebookShareURL, TwitterShareURL, ShareByMailLink ]
    // 11a.In case of changing the TinyURL service
    //     Specify URL for the new service            - [ Tag(s) to look for: MapSharingOptions (set TinyURLServiceURL, TinyURLResponseAttribute) ]


    // ------------------------------------------------------------------------------------------------------------------------
    // GENERAL SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set application title
    ApplicationName: "Citizen Service Request",

    // Set application icon path
    ApplicationIcon: "images/logo.png",

    // Set splash window content - Message that appears when the application starts
    SplashScreenMessage: "<br/><b>Submit a Request for Service:</b><br/><br/>Please search for an address or click directly on the map to locate your request for service. Then, provide additional detail and click or tap Submit to initiate your request.</br></br>If you find a request has already been submitted, you can click or tap on the existing request, provide additional comments and increase the importance of the request.<br/><br/>If you are using an iOS device, you'll need a third-party software application called Picup to submit a photo, video or other document related to a service request.<br/>",

    // Set URL of help page/portal
    HelpURL: "help.htm",

    // ------------------------------------------------------------------------------------------------------------------------
    // BASEMAP SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set baseMap layers
    // Please note: All base maps need to use the same spatial reference. By default, on application start the first basemap will be loaded

    BaseMapLayers:
          [
                    {
                        Key: "parcelMap",
                        ThumbnailSource: "images/parcelmap.png",
                        Name: "Streets",
                        MapURL: "http://localgovtemplates.esri.com/ArcGIS/rest/services/ParcelPublicAccess/MapServer"
                     },
                    {
                        Key: "hybridMap",
                        ThumbnailSource: "images/imageryhybrid.png",
                        Name: "Imagery",
                        MapURL: "http://localgovtemplates.esri.com/ArcGIS/rest/services/ImageryHybrid/MapServer"
                    }
          ],

    // Initial map extent. Use comma (,) to separate values and don t delete the last comma
    DefaultExtent: "-9815317.353,5126118.542,-9811259.298,5127735.811",


    // ------------------------------------------------------------------------------------------------------------------------
    // OPERATIONAL DATA SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------

    // if not using WebMap, set the following options
    // Configure operational layers:
    ServiceRequestLayerURL:
          {
              ServiceURL: "http://localgovtemplates2.esri.com/ArcGIS/rest/services/CitizenService/ServiceRequest/FeatureServer/0"
          },
    ServiceRequestmobileLayerURL:
          {
              ServiceURL: "http://localgovtemplates2.esri.com/ArcGIS/rest/services/CitizenService/ServiceRequest/FeatureServer/0"
          },

    ServiceRequestCommentsLayerURL:
          {
              ServiceURL: "http://localgovtemplates2.esri.com/ArcGIS/rest/services/CitizenService/ServiceRequest/FeatureServer/1"
          },


    // ------------------------------------------------------------------------------------------------------------------------
    // INFO-WINDOW SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------

    // Info-window is a small, two line popup that gets displayed on selecting a feature
    // Set Info-window title. Configure this with text/fields
    InfoWindowHeader: "Request Number: ${REQUESTID}",

    // Choose content/fields for the info window
    InfoWindowContent: "${REQUESTTYPE}",

    // ------------------------------------------------------------------------------------------------------------------------
    // INFO-POPUP SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------

    // Info-popup is a popup dialog that gets displayed on selecting a feature
    // Set the content to be displayed on the info-Popup. Define labels, field values, field types and field formats
    InfoWindowData:
          [
                    {
                        DisplayText: "Problem:",
                        AttributeValue: "${REQUESTTYPE}",
                        DataType: "string"
                    },
                    {
                        DisplayText: "Comment:",
                        AttributeValue: "${COMMENTS}",
                        DataType: "string"
                    },
                    {
                        DisplayText: "Submitted On:",
                        AttributeValue: "${REQUESTDATE}",
                        DataType: "date"
                    },
                    {
                        DisplayText: "Status:",
                        AttributeValue: "${STATUS}",
                        DataType: "string"
                    }
          ],

    // Set this to true to show "Comments" tab in the info-Popup
    ShowCommentsTab: true,

    // Set size of the info-Popup - select maximum height and width in pixels (not applicable for tabbed info-Popup)
    //minimum height should be 270 for the info-popup in pixels
    InfoPopupHeight: 310,

    //minimum width should be 330 for the info-popup in pixels
    InfoPopupWidth: 330,

    // Set string value to be shown for null or blank values
    ShowNullValueAs: "N/A",

    // Set date format
    FormatDateAs: "MMM dd, yyyy",


    // ------------------------------------------------------------------------------------------------------------------------
    // ADDRESS SEARCH SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set Locator service URL
    LocatorURL: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Locators/TA_Address_NA_10/GeocodeServer",

    // Set Locator fields (fields to be used for searching)
    LocatorFields: "SingleLine",

    // Set default address to search
    LocatorDefaultAddress: "971 Sylvan Cir, Naperville, IL, 60540",

    // Set pushpin image path

    LocatorMarkupSymbolURL: "images/pushpin.png",

    // ------------------------------------------------------------------------------------------------------------------------
    // GEOMETRY SERVICE SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------

    // Set geometry service URL
    GeometryService: "http://localgovtemplates2.esri.com/ArcGIS/rest/services/Geometry/GeometryServer",


    // ------------------------------------------------------------------------------------------------------------------------
    // SETTING FOR PICUP
    // ------------------------------------------------------------------------------------------------------------------------

    //flag to set for uploading images into iOS devices (uses 3rd party application to upload pictures)
    EnablePhotoUploadiOS: true,
    //Message displayed for 3rd party software. This is a HTML text
    PhotoUploadText: "Add attachment <hr/> <br/>This application uses \"Picup\" to add photos. You can download it from <a href='http://picupapp.com/' target='_blank'>PickupApp.com</a>",

    // ------------------------------------------------------------------------------------------------------------------------
    // SETTINGS FOR MAP SHARING
    // ------------------------------------------------------------------------------------------------------------------------

    // Set URL for TinyURL service, and URLs for social media
    MapSharingOptions:
          {
              TinyURLServiceURL: "http://api.bit.ly/v3/shorten?login=esri&apiKey=R_65fd9891cd882e2a96b99d4bda1be00e&uri=${0}&format=json",
              TinyURLResponseAttribute: "data.url",
              FacebookShareURL: "http://www.facebook.com/sharer.php?u=${0}&t=Citizen%20Service%20Request",
              TwitterShareURL: "http://twitter.com/home/?status=Citizen%20Service%20Request ${0}",
              ShareByMailLink: "mailto:%20?subject=Checkout%20this%20map!&body=${0}"
          }

});
