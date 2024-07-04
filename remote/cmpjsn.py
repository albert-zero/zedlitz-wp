'''
Created on 01.02.2023

@author: Albert Zedlitz
'''
import os.path
import re
import json
import argparse
from   pathlib import Path
from   enum    import Enum


class Languages(Enum):
    """ Enumeration of supported languages """
    de = 'de_DE'
    en = 'en_EN'


gRootPath = Path().home().joinpath('Projects', 'plugin', 'zedlitz-wp', 'locales')


# ---
def getFileName(aLanguage: str = "") -> Path: 
    """ Returns the source file location for translation and destination """
    xFile = "" 
    if len(aLanguage) > 2:
        xFile = gRootPath.joinpath( aLanguage, "LC_MESSAGES", "content.po" )
    else:
        xFile = gRootPath.joinpath( "content.json" )        
    return xFile


# ---
def doSplitFile(aFile: Path) -> dict:
    """ Compiles the input and returns the result in a JSON format dictionary """
    with aFile.open( mode="r", encoding="utf-8") as f:
        xContent = f.read()
        xResArr  = re.findall(r'msgid[\s]+"(.*)"[\s]+msgstr[\s]+"([^"]+)"', xContent)
        xDict    = { xKey.lower() : xVal.replace('\n', ' ').encode('ascii', 'xmlcharrefreplace').decode('utf-8') for xKey, xVal in xResArr }
    return xDict


# ---
if __name__ == "__main__":
    """ Main entry """
    # Command line argument handling
    parser    = argparse.ArgumentParser(
        prog        = 'cmpjson.py',
        description = 'Generate a *.json translation file from *.po (portable objects) files')

    parser.add_argument( "-d", "--directory", dest='directory',    help="specify the 'locales' directory (default ~/Projects/plugin/zedlitz-wp/locales)")
    parser.add_argument( "-t", "--test",      action='store_true', help="test: some output and exit")
    arguments = parser.parse_args()
    if arguments.directory:
        gRootPath = Path( arguments.directory )  
        print(gRootPath) 

    if arguments.test:
        for i in Languages:
            print(i.value)
        exit()
    
    # Prepare and run the compiler for each supported language    
    xDict     = dict()

    # Process the input
    for xLocale in Languages:
        xFile                  = getFileName( xLocale.value  )
        xDict[ xLocale.value ] = doSplitFile( xFile ) 
    
    # Dump the result
    xFile   = getFileName()
    
    with xFile.open( mode="w+", encoding="utf-8" ) as f:
        json.dump(xDict, f, indent=2)
        #xPrettyPrint = pprint.PrettyPrinter(indent=4, stream=f, width=200)
        #xPrettyPrint.pprint(xDict)
    
    # Some success message and check, if all keys are consistent in all languages:    
    print(f"created json: {xFile}")    

    xDe   = xDict[Languages.de.value]
    xEn   = xDict[Languages.en.value]
    
    xDiff = [ x for x in xDe if x not in xEn ]
    print( f"Keys in D and not in E \n{xDiff}" )
    
    xDiff = [ x for x in xEn if x not in xDe ]
    print( f"Keys in E and not in D \n{xDiff}" )
    

