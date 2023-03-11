'''
Created on 01.02.2023

@author: Albert Zedlitz
'''
import os.path
import re
import json
import argparse
from   pathlib import Path

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

    parser.add_argument( "-d", "--directory", dest='directory', help="specify the 'locales' directory (default ~/Projects/plugin/zedlitz-wp/locales)")
    arguments = parser.parse_args()
    if arguments.directory:
        gRootPath = Path( arguments.directory )  
        print(gRootPath) 
    
    # Prepare and run the compiler for each supported language    
    xDict     = dict()

    # Process the input
    for xLoc in ["de_DE", "en_EN"]:
        xFile       = getFileName(xLoc)
        xDict[xLoc] = doSplitFile(xFile) 
    
    # Dump the result
    xFile   = getFileName()
    
    with xFile.open( mode="w+", encoding="utf-8" ) as f:
        json.dump(xDict, f)
        #xPrettyPrint = pprint.PrettyPrinter(indent=4, stream=f, width=200)
        #xPrettyPrint.pprint(xDict)
    
    # Some success message and check, if all keys are consistent in all languages:    
    print(f"created json: {xFile}")    

    xDe   = xDict["de_DE"]
    xEn   = xDict["en_EN"]
    
    xDiff = [ x for x in xDe if x not in xEn ]
    print( f"Keys in D and not in E \n{xDiff}" )
    
    xDiff = [ x for x in xEn if x not in xDe ]
    print( f"Keys in E and not in D \n{xDiff}" )
    

