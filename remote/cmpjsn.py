'''
Created on 01.02.2023

@author: Albert Zedlitz
'''
import os.path
import re
import json
import argparse

# import pprint


# Return the *.po input  file name if a language is given
# Return the json output file name if language is empty
def getFileName(aLanguage: str = "") -> str: 
    xRoot = os.path.expanduser("~") + r"/Projects/plugin/zedlitz-wp/locales"
    xFile = "" 
    if len(aLanguage) > 2:
        xFile = os.path.join(xRoot, aLanguage, "LC_MESSAGES", "content.po")
    else:
        xFile = os.path.join(xRoot, "content.json")        
    return xFile

# Compiles the input *.po file into a dictionary
def doSplitFile(aFile: str) -> dict:
    with open(aFile, "r", encoding="utf-8") as f:
        xContent = f.read()
        xResArr  = re.findall(r'msgid[\s]+"(.*)"[\s]+msgstr[\s]+"([^"]+)"', xContent)
        xDict    = { xKey.lower() : xVal.replace('\n', ' ').encode('ascii', 'xmlcharrefreplace').decode('utf-8') for xKey, xVal in xResArr }
    return xDict

# Main entry
if __name__ == "__main__":
    parser    = argparse.ArgumentParser(
        prog        = 'cmpjson.py',
        description = 'Generate json translation file from portable objects')
    parser.add_argument('directory')
    arguments = parser.parse_args()

    xDict     = dict()

    # Process the input
    for xLoc in ["de_DE", "en_EN"]:
        xFile       = getFileName(xLoc)
        xDict[xLoc] = doSplitFile(xFile)
    
    # Dump the result
    xFile   = getFileName()
    
    with open(xFile, "w+", encoding="utf-8") as f:
        json.dump(xDict, f)
        #xPrettyPrint = pprint.PrettyPrinter(indent=4, stream=f, width=200)
        #xPrettyPrint.pprint(xDict)
        
    print(f"created json: {xFile}")    

    xDe   = xDict["de_DE"]
    xEn   = xDict["en_EN"]
    
    xDiff = [ x for x in xDe if x not in xEn ]
    print(f"Keys in D and not in E \n{xDiff}")
    
    xDiff = [ x for x in xEn if x not in xDe ]
    print(f"Keys in E and not in D \n{xDiff}")
        
    
    
    
    