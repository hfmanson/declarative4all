const
  xqeval = async function(xmldoc, xexpr, node, env) {
    try {
      return await xmldoc.evaluate(xexpr, node, env)
    } catch(e) {
    }
  }
  , xquery = 
`
declare namespace chain="http://mansoft.nl/chain";
declare namespace xlink="http://www.w3.org/1999/xlink";
declare namespace svg="http://www.w3.org/2000/svg";


declare function local:process-field($row, $column, $field ) {
  let
    $x := ($column - 1) * 10 + 1
    , $y := ($row  - 1) * 10 + 1
  return
    if (empty($field)) then
      <use xmlns="http://www.w3.org/2000/svg" xlink:href="#empty" x="{$x}" y="{$y}"/>
    else
      <use xmlns="http://www.w3.org/2000/svg" xlink:href="{concat('#', $field/@shape)}" x="{$x}" y="{$y}" fill="{$field/@color}" color="{if ($field/@state = 'current') then 'black' else if ($field/@state = 'visited') then 'white' else $field/@color}" chain:row="{$row}" chain:column="{$column}"/>
};

declare function local:renderlevel($leveldoc) {
	let $chainreaction := $leveldoc/chain:chain-game
		, $chain-field := $leveldoc/chain:chain-game/chain:field
		, $columns := xs:integer($chainreaction/@columns)
		, $rows := xs:integer($chainreaction/@rows)
	return
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%" height="100%"
			viewBox="0 0 {$columns * 10 + 2} {$rows * 10 + 2}"
		>
			<defs>
				<rect id="empty" width="10" height="10" stroke="lightgrey" fill="white" stroke-width="0.2"/>
				<g id="circle" stroke-width="0.5">
					<use xlink:href="#empty"/>
					<circle r="3.8" cx="5" cy="5"/>
					<line x1="3" y1="3" x2="7" y2="7" stroke="currentColor"/>
					<line x1="3" y1="7" x2="7" y2="3" stroke="currentColor"/>
				</g>
				<g id="square" stroke-width="0.5">
					<use xlink:href="#empty"/>
					<rect x="1.5" y="1.5" width="7" height="7"/>
					<line x1="3" y1="3" x2="7" y2="7" stroke="currentColor"/>
					<line x1="3" y1="7" x2="7" y2="3" stroke="currentColor"/>
				</g>
			</defs>
			<g id="game">
			{
				for $row in 1 to $rows, $column in 1 to $columns
					let
						$field := $chain-field[xs:integer(@row) = $row][xs:integer(@column) = $column]
					return local:process-field($row, $column, $field)
			}
			</g>
		</svg>
};

local:renderlevel(.)
`
  , xqueryupdate =
`
declare namespace chain="http://mansoft.nl/chain";
declare namespace xlink="http://www.w3.org/1999/xlink";
declare namespace svg="http://www.w3.org/2000/svg";

declare variable $model external;

declare function local:click($use, $evtObj) {
  let
    $field := $model/chain:chain-game/chain:field
    , $unvisited := $field[@state = 'unvisited']
    , $new-field := $field[@row = $use/@chain:row][@column = $use/@chain:column]
    , $current-field := $field[@state = 'current']
    , $current-row := $current-field/@row
    , $current-col := $current-field/@column
    , $new-row := $new-field/@row
    , $new-col := $new-field/@column
    , $current-svg-color := $use/../svg:use[@chain:row = $current-row][@chain:column = $current-col]/@color
    , $new-svg-color := $use/@color

  return
  if ($new-field/@state = 'current') then 
    b:alert('Same position')
  else if ($new-row != $current-row and $new-col != $current-col) then
    b:alert('Bad move: Stay in row or column')
  else if ($new-field/@state = 'visited') then
    b:alert('Bad move: Already been there')
  else if ($new-field/@shape != $current-field/@shape and $new-field/@color != $current-field/@color) then
    b:alert('Bad move: Must match colour or shape')
  else
  (
    if (count($unvisited) = 1) then b:alert('Solved!') else (),
    replace value of node $current-field/@state with 'visited',
    replace value of node $new-field/@state with 'current',
    replace value of node $current-svg-color with 'white',
    replace value of node $new-svg-color with 'black',
  )
};

for $use in svg:g[@id = 'game']/svg:use[@xlink:href != '#empty']
return b:addEventListener($use, "click", local:click#2)
`
  , level =
`
<chain-game xmlns="http://mansoft.nl/chain" rows="5" columns="5">
	<field row="1" column="2" shape="circle" color="blue" state="unvisited"/>
	<field row="1" column="3" shape="square" color="red" state="unvisited"/>
	<field row="1" column="4" shape="square" color="green" state="unvisited"/>
	<field row="2" column="1" shape="square" color="red" state="unvisited"/>
	<field row="2" column="2" shape="square" color="green" state="unvisited"/>
	<field row="2" column="4" shape="circle" color="blue" state="unvisited"/>
	<field row="2" column="5" shape="circle" color="red" state="unvisited"/>
	<field row="3" column="1" shape="circle" color="green" state="unvisited"/>
	<field row="3" column="3" shape="circle" color="red" state="current"/>
	<field row="3" column="5" shape="square" color="green" state="unvisited"/>
	<field row="4" column="1" shape="square" color="blue" state="unvisited"/>
	<field row="4" column="2" shape="circle" color="blue" state="unvisited"/>
	<field row="4" column="4" shape="square" color="blue" state="unvisited"/>
	<field row="4" column="5" shape="circle" color="green" state="unvisited"/>
	<field row="5" column="2" shape="circle" color="red" state="unvisited"/>
	<field row="5" column="3" shape="square" color="green" state="unvisited"/>
	<field row="5" column="4" shape="square" color="red" state="unvisited"/>
</chain-game> 
`
  ;

addEventListener("load", function run() {
  try {
    var domparser = new DOMParser();
    var xmldoc = domparser.parseFromString(level, "application/xml");
  } catch(e) {
    console.log("Exception!\n" + e.message);
  }
  xqeval(xmldoc, xquery).then((res) => {
    var el = res.iterateNext();
    if (el) {
      const
	      env = {
	        args: {
	          model: xmldoc
	        }
	      }
	      ;
	      
      document.getElementById("chainreaction").appendChild(el);
      xqeval(document, xqueryupdate, el, env);
    }          
  });
}, false);