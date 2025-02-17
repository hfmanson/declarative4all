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
