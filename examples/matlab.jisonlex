D                       [0-9]
L                       [a-zA-Z_]
E                       [DdEe][+-]?{D}+


%START ST TR
%%
"%".*$                  { ECHO; }
"!".*$                  { ECHO; }

"break"                 { BEGIN ST; return(BREAK); }
"clear"                 { BEGIN ST; return(CLEAR); }
"else"                  { BEGIN ST; return(ELSE); }
"end"                   { BEGIN ST; return(END); }
"elseif"                { BEGIN ST; return(ELSEIF); }
"for"                   { BEGIN ST; return(FOR); }
"function"              { BEGIN ST; return(FUNCTION); }
"global"                { BEGIN ST; return(GLOBAL); }
"if"                    { BEGIN ST; return(IF); }
"return"                { BEGIN ST; return(RETURN); }
"while"                 { BEGIN ST; return(WHILE); }

{L}({L}|{D})*           { BEGIN TR; return(check_type()); }

{D}+({E})?              { BEGIN TR; return(CONSTANT); }
{D}*"."{D}+({E})?       { BEGIN TR; return(CONSTANT); }
{D}+"."{D}*({E})?       { BEGIN TR; return(CONSTANT); }

<ST>'[^'\n]*'/'         { BEGIN ST; yymore(); }
<ST>'[^'\n]*'           { BEGIN 0;  return(STRING_LITERAL); }
<TR>'                   { BEGIN TR; return(TRANSPOSE); }

".*"                    { BEGIN ST; return(ARRAYMUL); }
".^"                    { BEGIN ST; return(ARRAYPOW); }
"./"                    { BEGIN ST; return(ARRAYDIV); }
".\\"                   { BEGIN ST; return(ARRAYRDIV); }
".'"                    { BEGIN TR; return(TRANSPOSE); }
"<="                    { BEGIN ST; return(LE_OP); }
">="                    { BEGIN ST; return(GE_OP); }
"=="                    { BEGIN ST; return(EQ_OP); }
"~="                    { BEGIN ST; return(NE_OP); }
"~"                     { BEGIN ST; return('~'); }
";"                     { BEGIN ST; return(';'); }
","                     { BEGIN ST; return(','); }
":"                     { BEGIN ST; return(':'); }
"="                     { BEGIN ST; return('='); }
"("                     { BEGIN ST; return('('); }
")"                     { BEGIN TR; return(')'); }
"["                     { BEGIN ST; return('['); }
"]"                     { BEGIN TR; return(']'); }
"&"                     { BEGIN ST; return('&'); }
"-"                     { BEGIN ST; return('-'); }
"+"                     { BEGIN ST; return('+'); }
"*"                     { BEGIN ST; return('*'); }
"/"                     { BEGIN ST; return('/'); }
"\\"                    { BEGIN ST; return('\\'); }
"<"                     { BEGIN ST; return('<'); }
">"                     { BEGIN ST; return('>'); }
"^"                     { BEGIN ST; return('^'); }
"|"                     { BEGIN ST; return('|'); }
\n                      { BEGIN ST; return(CR); }
[ \t\v\f]               { BEGIN ST; }
.                       { BEGIN ST; /* ignore bad characters */ }
