# xml feed report

This lightweight tool provides a detailed report of what data is an xml file. It validates its contents and shows every node that was seen and how many occurances with data it had. Finally, it outputs sample data from various places in the document.

## Instructions

Install the dependencies:

```npm install```

Execute the bash script with intended file:

```bash report.sh ~/Downloads/test.xml```

## Sample Output

```
Validating with XML Lint:
----------------------
No XML errors found.

Generating XML Report:
----------------------

 OUTPUT
 <node_name>  <total_nodes> / <total_nodes_with_data>
  - <random_sample_data>

 • response  1 / 0
   ○ row  1 / 0
     ■ row  7344 / 0
       ▫ yearstart  7344 / 7344
         - 2008
         - 2008
         - 2010
         - 2010
         - 2012
       ▫ yearend  7344 / 7344
         - 2008
         - 2008
         - 2010
         - 2010
         - 2012
       ▫ locationabbr  7344 / 7344
         - HI
         - MI
         - NC
         - UT
         - AR
       ▫ locationdesc  7344 / 7344
         - Hawaii
         - Michigan
         - North Carolina
         - Utah
         - Arkansas
```

