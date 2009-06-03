/*
 *  Copyright (C) 2009 LI Daobing <lidaobing@gmail.com>
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

#ifndef __CHMSEE_UTILS_UTILS_H__
#define __CHMSEE_UTILS_UTILS_H__

#include <stdio.h>
#include <glib.h>

G_BEGIN_DECLS

#ifdef ENABLE_NLS
#  include <libintl.h>
#  undef _
#  define _(String) dgettext (PACKAGE, String)
#  ifdef gettext_noop
#    define N_(String) gettext_noop (String)
#  else
#    define N_(String) (String)
#  endif
#else
#  define textdomain(String) (String)
#  define gettext(String) (String)
#  define dgettext(Domain,Message) (Message)
#  define dcgettext(Domain,Message,Type) (Message)
#  define bindtextdomain(Domain,Directory) (Domain)
#  define _(String) (String)
#  define N_(String) (String)
#endif

gchar *convert_filename_to_utf8(const gchar *, const gchar *);
gchar *convert_string_to_utf8(const gchar *, const gchar *);
gint ncase_compare_utf8_string(const gchar *, const gchar *);
gchar *file_exist_ncase(const gchar *);
char *url_decode(const char*);
void command_delete_tmpdir(const gchar *);
gchar *get_real_uri(const gchar *);

/**
 * return the correct filename
 *
 * @param fname the original filename
 *
 * @return NULL if failed.
 *
 * @return char* if new file name, The string returned is new and it's
 * the caller's responsibility to free the string.
 */
char* correct_filename(const gchar* fname);


/**
 * read config file.
 *
 * @param info config file title, only used in print error info.
 * @param file config file name.
 *
 * @return a GList with Item in it.
 */
GList* parse_config_file(const gchar *info, const gchar *file);

/**
 * free the GList* generated by <code>parse_config_file</code>
 *
 * @param config the GList* generated by parse_config_file
 */
void free_config_list(GList *config);

/**
 * save a id, value pair in a FILE, readable by parse_config_file
 *
 * @param ofile output file
 * @param id the id string (also known as "key")
 * @param value  the value string
 */
void save_option(FILE* ofile, const gchar *id, const gchar *value);

typedef struct {
        gchar *id;
        gchar *value;
} Item;

const gchar* get_encoding_by_lcid(guint32 lcid);

const gchar* get_data_dir();
#define CHMSEE_DATA_DIR get_data_dir()

void set_data_dir(const gchar* datadir);

const gchar* get_resource_path(const gchar* resouce_name);

/**
 * a helper function for SAX, get attr value by the key
 */
const gchar* get_attr(const gchar** attrs, const gchar* key);

G_END_DECLS

#endif
