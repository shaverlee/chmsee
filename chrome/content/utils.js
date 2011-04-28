/*
 *  Copyright (C) 2011 Ji YongGang <jungleji@gmail.com>
 *
 *  ChmSee is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2, or (at your option)
 *  any later version.

 *  ChmSee is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.

 *  You should have received a copy of the GNU General Public License
 *  along with ChmSee; see the file COPYING.  If not, write to
 *  the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 *  Boston, MA 02110-1301, USA.
 */

var EXPORTED_SYMBOLS = ["Prefs", "LastUrls", "d", "CsScheme"];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;

var CsScheme = "file://";

/*** Read/Save preference ***/

const application = Cc["@mozilla.org/fuel/application;1"].getService(Ci.extIApplication);
const dirService = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties);
const homeDir = dirService.get("Home", Ci.nsIFile);

var Prefs = {
    get lastDir() {
        var path;
        if (application.prefs.has("chmsee.open.lastdir")) {
            path = application.prefs.get("chmsee.open.lastdir").value;
        } else {
            path = homeDir.path;
            application.prefs.setValue("chmsee.open.lastdir", path);
        }

        var dir = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
        dir.initWithPath(path);
        return dir;
    },

    set lastDir(dir) {
        application.prefs.setValue("chmsee.open.lastdir", dir.path);
    },

    get bookshelf() {
        var path;
        if (application.prefs.has("chmsee.bookshelf.dir")) {
            path = application.prefs.get("chmsee.bookshelf.dir").value;
        } else {
            path = homeDir.path + "/.chmsee/bookshelf";
            application.prefs.setValue("chmsee.bookshelf.dir", path);
        }

        bookshelfDir = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
        bookshelfDir.initWithPath(path);

        return bookshelfDir;
    },

    set bookshelf(dir) {
        application.prefs.setValue("chmsee.bookshelf.dir", dir.path);
    },
};

var LastUrls = {
    get reopen () {
        if (application.prefs.has("chmsee.open.lasturls")) {
            return application.prefs.get("chmsee.open.lasturls").value;
        } else
            return false;
    },

    set reopen (val) {
        application.prefs.setValue("chmsee.open.lasturls", val);
    },

    save: function (urls) {
        var data = JSON.stringify(urls);

        var profileDir = dirService.get("ProfD", Ci.nsIFile);

        d("LastUrls::save", "profile = " + profileDir.path);

        var urlsFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
        urlsFile.initWithPath(profileDir.path + "/lastUrls.json");

        var foStream = Cc["@mozilla.org/network/file-output-stream;1"].createInstance(Ci.nsIFileOutputStream);
        foStream.init(urlsFile, -1, -1, 0);

        var converter = Cc["@mozilla.org/intl/converter-output-stream;1"].createInstance(Ci.nsIConverterOutputStream);
        converter.init(foStream, "UTF-8", 0, 0);
        converter.writeString(data);
        converter.close();
    },

    read: function () {
        var profileDir = dirService.get("ProfD", Ci.nsIFile);

        var urlsFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
        urlsFile.initWithPath(profileDir.path + "/lastUrls.json");
        d("LastUrls::read", "urlsFile = " + urlsFile.path);

        var data = "";
        var fstream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream);
        var cstream = Cc["@mozilla.org/intl/converter-input-stream;1"].createInstance(Ci.nsIConverterInputStream);
        fstream.init(urlsFile, -1, 0, 0);
        cstream.init(fstream, "UTF-8", 0, 0);

        let (str = {}) {
            let read = 0;
            do {
                read = cstream.readString(0xffffffff, str);
                data += str.value;
            } while (read != 0);
        }
        cstream.close();
        return data;
    },
};

/*** Debug ***/

const CsDebug = true;

var d = function (f, s) {
    if (CsDebug)
        dump(f + " >>> " + s + "\n");
};