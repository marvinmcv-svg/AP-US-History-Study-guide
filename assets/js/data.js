/* Shared helpers + all study content (used by every page) */
/* tiny localStorage wrapper shared by every page */
const store = {
  get(k,d){ try{ const v = localStorage.getItem("apushq_"+k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set(k,v){ try{ localStorage.setItem("apushq_"+k, JSON.stringify(v)); }catch(e){} }
};
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
/* =========================================================
   DATA
   ========================================================= */
const UNITS = [
{
  id:1, title:"Native Societies & Contact", years:"1491–1607", weight:"4–6%", color:"--u1", emoji:"🌽",
  hook:"Before 1492, the Americas were full of millions of people living very different lives. Then Columbus showed up, and two worlds that had been apart for 10,000+ years crashed together.",
  story:[
    "<b>Before Europeans arrived</b>, Native American societies were incredibly diverse because they adapted to their <i>environments</i>. In the dry Southwest, the <b>Pueblo</b> grew <b>maize</b> (corn) using irrigation and built adobe homes. On the Great Plains, people moved with the seasons and hunted buffalo. In the Northeast, groups like the <b>Iroquois</b> mixed farming with hunting and lived in longhouses. On the Northwest coast, fishing was so rich that people could build permanent villages without farming. The <b>Mississippian</b> culture built huge mound cities like <b>Cahokia</b>.",
    "<b>Why did Europe go exploring?</b> Remember the 3 G's: <b>God</b> (spread Christianity), <b>Gold</b> (get rich and find trade routes to Asia), <b>Glory</b> (national power). New tech like the <b>caravel</b> ship, compass and astrolabe made it possible. Spain and Portugal led the way, and in <b>1492</b> Columbus landed in the Caribbean.",
    "<b>The Columbian Exchange</b> changed the whole planet. Europe sent horses, pigs, cattle, wheat, sugar, and, worst of all, <b>diseases like smallpox</b> that killed up to 90% of some Native populations. The Americas sent <b>corn, potatoes, tomatoes, tobacco</b>, which caused Europe's population to boom.",
    "<b>The Spanish built an empire</b> fast: <b>Cortés</b> conquered the Aztecs (1519–21) and <b>Pizarro</b> the Inca (1532). They used the <b>encomienda system</b> (forced Native labor), and when Native populations collapsed, they turned to <b>enslaved Africans</b>, starting the Atlantic slave trade. A racial ladder called the <b>casta system</b> ranked people by ancestry. Priest <b>Bartolomé de Las Casas</b> protested the cruelty, sparking the famous <b>Valladolid Debate</b> (1550) about whether Natives were fully human."
  ],
  concepts:[
    ["Native diversity = environment", ["Southwest (Pueblo): maize, irrigation, adobe, permanent villages","Great Plains: mobile, hunting buffalo (and later the horse transformed them)","Northeast (Iroquois): mixed farming + hunting, longhouses, Iroquois Confederacy","Northwest: fishing & whaling, permanent villages, rich trade","Key idea: maize spread north from Mexico → allowed settled societies"]],
    ["Why Europeans explored", ["God, Gold, Glory","Desire for a sea route to Asian trade (avoid Ottoman control)","New technology: caravel, compass, astrolabe, better maps","Reconquista (1492): Spain drove out the Muslims → unified, Catholic, ambitious"]],
    ["Columbian Exchange", ["Old → New: horses, cattle, pigs, wheat, sugar, smallpox & measles","New → Old: maize, potatoes, tomatoes, tobacco, cacao","Silver from the Americas made Spain rich → shift from feudalism to capitalism in Europe","Disease = the #1 reason Native populations collapsed"]],
    ["Spanish colonial system", ["Encomienda: Spanish colonists got the right to Native labor & tribute","Casta system: racial hierarchy (peninsulares → criollos → mestizos → Natives & Africans)","Missions to convert Natives to Catholicism","Spanish mixed with Natives more than the English did, and built a large, controlled empire"]],
    ["Native responses", ["Resistance (war, revolts)","Adaptation (adopting horses, guns, some Christianity while keeping traditions)","Negotiation and alliances with Europeans","Pattern for the whole course: Natives were not passive victims!"]]
  ],
  terms:[
    ["Pueblo","c. 1000s","Southwest Native people who farmed maize with irrigation and lived in multi-story adobe buildings.","Shows how environment shaped Native societies."],
    ["Maize cultivation","c. 1200s spread","Corn farming that spread from Mexico into North America.","Allowed settled, complex societies to develop."],
    ["Iroquois Confederacy","c. 1400s","Alliance of five (later six) Northeastern nations; lived in longhouses, mixed farming & hunting.","A powerful Native political alliance that later played Europeans against each other."],
    ["Cahokia","c. 1050–1350","Huge Mississippian mound city near modern St. Louis.","Proves complex urban societies existed before Europeans."],
    ["Christopher Columbus","1492","Sailed for Spain looking for Asia and landed in the Caribbean.","Started permanent contact between Europe and the Americas."],
    ["Columbian Exchange","1492 →","Transfer of plants, animals, people, and diseases between the hemispheres.","Changed diets, populations and economies worldwide; devastated Natives."],
    ["Treaty of Tordesillas","1494","Pope-backed line splitting new lands between Spain and Portugal.","Why Brazil speaks Portuguese and most of Latin America speaks Spanish."],
    ["Encomienda system","1500s","Spanish crown gave colonists the right to demand labor & tribute from Natives.","Brutal forced labor → led to the shift to African slavery."],
    ["Hernán Cortés","1519–1521","Conquistador who conquered the Aztec Empire.","Spain gains Mexico's wealth; disease & Native allies helped him."],
    ["Francisco Pizarro","1532","Conquistador who conquered the Inca Empire.","Huge silver wealth flows to Spain."],
    ["Bartolomé de Las Casas","1540s","Spanish priest who exposed the abuse of Natives.","Argued Natives were fully human; led to reform debates."],
    ["Valladolid Debate","1550","Las Casas vs. Sepúlveda over whether Natives were 'natural slaves.'","Shows European debate over how to treat Native peoples."],
    ["Casta system","1500s","Spanish racial hierarchy based on ancestry/mixing.","Created a rigid colonial social order based on race."],
    ["Atlantic slave trade","1500s →","Forced transport of millions of Africans to the Americas.","Replaced dying Native labor; shaped the economy of the Americas."],
    ["Mercantilism","1500s–1700s","Idea that colonies exist to enrich the mother country; export more than import.","Explains why Europe wanted colonies and later trade laws."]
  ],
  timeline:[
    [1050,"Cahokia rises as a major Mississippian city"],
    [1492,"Columbus lands in the Caribbean; Spain completes the Reconquista"],
    [1494,"Treaty of Tordesillas divides the New World"],
    [1519,"Cortés begins conquest of the Aztec Empire"],
    [1532,"Pizarro conquers the Inca"],
    [1550,"Valladolid Debate (Las Casas vs. Sepúlveda)"],
    [1565,"Spanish found St. Augustine, Florida"],
    [1598,"Juan de Oñate's brutal expedition into New Mexico"],
    [1607,"Jamestown founded: the end of Unit 1"]
  ],
  hacks:[
    ["The 3 G's","God · Gold · Glory","Why Europeans explored. If a question asks about motives, one of these is the answer."],
    ["What Europe sent over","H-P-S: Horses, Pigs, Smallpox","Old World → New World. Smallpox did the most damage."],
    ["What the Americas sent back","C-P-T: Corn, Potatoes, Tomatoes (+ Tobacco)","New World → Old World. Led to population growth in Europe."],
    ["Cortés vs. Pizarro","Cortés = Central Mexico (Aztec) · Pizarro = Peru (Inca)","C goes with C, P goes with P."]
  ],
  chains:[
    ["Spanish arrive in the Americas","Smallpox & forced labor (encomienda) kill millions of Natives","Spain needs a new labor force","Spain imports enslaved Africans → Atlantic slave trade grows","Racial hierarchy (casta system) develops"],
    ["Spanish bring horses","Plains Natives adopt the horse","Plains societies become highly mobile buffalo hunters","Horse-riding nations (e.g. Comanche, Lakota) become powerful"]
  ],
  quiz:[
    {q:"Which factor best explains why Native societies in North America before 1492 were so different from one another?", o:["They had no contact with each other","They adapted to very different environments and resources","Each had been influenced by different European nations","They all relied on the same crops"], a:1, e:"Environment drove everything. Desert Pueblo farmed with irrigation; Plains peoples hunted; Northwest peoples fished. No Europeans yet!"},
    {q:"The spread of maize cultivation from present-day Mexico northward most directly led to:", o:["The rise of nomadic hunting cultures","Economic development and settled, complex societies","The decline of the Iroquois","The end of trade between Native groups"], a:1, e:"Maize = food surplus = people can settle down, grow, and build complex societies (like the Pueblo)."},
    {q:"What was the most devastating effect of the Columbian Exchange on Native Americans?", o:["The introduction of wheat","Loss of land to Portuguese settlers","Epidemic diseases such as smallpox","Conversion to Protestantism"], a:2, e:"Natives had no immunity to Old World diseases. Smallpox and measles killed up to 90% of some populations."},
    {q:"The encomienda system is best described as:", o:["A Spanish system granting colonists rights to Native labor and tribute","A French alliance system with Native trading partners","An English system of indentured servitude","A Native American trade network"], a:0, e:"Encomienda = Spanish colonists got Native labor in exchange for 'protecting' and Christianizing them. In practice, it was close to slavery."},
    {s:"“Compare these qualities of prudence, ability, magnanimity, temperance, humanity, and religion [of the Spanish] with those of those little men [the Natives]… in whom you will scarcely find even vestiges of humanity.”", c:"Juan Ginés de Sepúlveda, 1547", q:"Sepúlveda's argument was most likely used to:", o:["Support ending the encomienda system","Justify Spanish conquest and forced labor of Natives","Argue for Native self-government","Promote trade alliances with Natives"], a:1, e:"Sepúlveda argued Natives were inferior 'natural slaves' to justify conquest. His opponent in the Valladolid Debate was Las Casas."},
    {q:"Bartolomé de Las Casas is best known for:", o:["Conquering the Inca","Leading the Pueblo Revolt","Criticizing Spanish mistreatment of Native peoples","Negotiating the Treaty of Tordesillas"], a:2, e:"Las Casas was a priest who exposed Spanish abuses and argued Natives had souls and rights."},
    {q:"The introduction of the horse to the Great Plains most directly caused:", o:["Plains peoples to abandon hunting","Plains peoples to become more mobile, buffalo-hunting societies","The spread of maize farming","The decline of the Spanish empire"], a:1, e:"Horses transformed Plains life: faster travel, better buffalo hunting, more powerful nomadic nations."},
    {q:"The Spanish casta system was primarily a:", o:["Religious order","System for distributing land","Social hierarchy based on racial ancestry","Military alliance"], a:2, e:"Casta = a racial ladder with Spanish-born at the top, and Natives and Africans at the bottom."},
    {q:"Which was a primary motive for European exploration in the 1400s and 1500s?", o:["Escaping the Industrial Revolution","Finding sea routes to Asian trade and gaining wealth","Spreading democracy","Finding land to grow cotton"], a:1, e:"Gold, God and Glory. Europeans wanted direct access to Asian spices and silks."}
  ]
},
{
  id:2, title:"Colonial America", years:"1607–1754", weight:"6–8%", color:"--u2", emoji:"🚢",
  hook:"England arrives late but stays. Different colonies grow up like different siblings: one obsessed with religion, one with tobacco money, one with diversity. Slavery takes root, and colonists start to feel 'American.'",
  story:[
    "<b>Jamestown (1607)</b>, Virginia, was England's first permanent colony, funded by the <b>Virginia Company</b> (a joint-stock company). It almost failed until <b>John Rolfe</b> planted <b>tobacco</b>, which became the Chesapeake's cash crop. They needed workers, so they used <b>indentured servants</b> (people who worked 4–7 years in exchange for passage) and the <b>headright system</b> (land for bringing people over). In 1619, the <b>House of Burgesses</b> became the first representative assembly, and the first Africans arrived.",
    "<b>New England</b> was different: families came for <i>religion</i>. The Pilgrims signed the <b>Mayflower Compact</b> (1620), and the Puritans under <b>John Winthrop</b> built a <b>“City upon a Hill”</b> in Massachusetts Bay (1630). They had town meetings, schools, small farms, fishing and shipbuilding. People who disagreed, like <b>Roger Williams</b> (founded Rhode Island) and <b>Anne Hutchinson</b>, got kicked out.",
    "<b>The Middle Colonies</b> (NY, PA, NJ, DE) were the most <b>diverse</b>: Quakers, Dutch, Germans, Scots-Irish. <b>William Penn</b> founded Pennsylvania (1681) with religious tolerance and fair dealing with Natives. They grew wheat, making them the “breadbasket.” <b>The Southern Colonies</b> (Carolinas, Georgia) grew rice and indigo with huge numbers of enslaved Africans.",
    "<b>Turning point: Bacon's Rebellion (1676).</b> Poor former servants in Virginia rebelled against the governor. Scared rich planters then switched from indentured servants to <b>enslaved Africans</b>, a permanent, race-based labor system. Slave codes made slavery hereditary. Enslaved people resisted (e.g. the <b>Stono Rebellion</b>, 1739).",
    "<b>Native conflicts:</b> <b>King Philip's War</b> (1675) in New England and the <b>Pueblo Revolt</b> (1680) against the Spanish in New Mexico. <b>The British Empire</b> tried to control trade with the <b>Navigation Acts</b> (mercantilism) but mostly practiced <b>salutary neglect</b>, letting colonies govern themselves. Meanwhile, the <b>Great Awakening</b> (religious revival) and the <b>Enlightenment</b> (reason, natural rights: John Locke) shaped a new colonial identity."
  ],
  concepts:[
    ["Regions compared", ["New England: religion (Puritans), family groups, town meetings, small farms, fishing, shipbuilding, literacy","Middle: diverse, tolerant, wheat ('breadbasket'), ports like Philadelphia & New York","Chesapeake (VA, MD): tobacco, indentured servants → slaves, young single men, high death rates","Southern / Carolina: rice & indigo, majority enslaved population, strict slave codes (from Barbados)"]],
    ["Spain vs. France vs. England vs. Netherlands", ["Spain: conquest, missions, encomienda, lots of mixing (casta)","France: fur trade, few settlers, alliances & intermarriage with Natives","Netherlands: trade-focused (New Amsterdam → New York 1664)","England: lots of settlers (families), took land, little mixing, colonies had self-government"]],
    ["Labor & slavery", ["Indentured servitude dominated the early Chesapeake","Bacon's Rebellion (1676) → shift to African slavery","Triangular trade & Middle Passage","Slave codes made slavery permanent, hereditary, and race-based","Resistance: Stono Rebellion (1739), running away, slowdowns, keeping culture"]],
    ["British control & trade", ["Mercantilism: colonies serve the mother country","Navigation Acts: colonial trade must go through England on English ships","Dominion of New England (1686): James II merged colonies; collapsed after the Glorious Revolution (1688)","Salutary neglect: Britain loosely enforced laws → colonies got used to self-rule"]],
    ["Ideas & identity", ["Great Awakening (1730s–40s): Jonathan Edwards, George Whitefield; emotional religion, questioned authority, shared colonial experience","Enlightenment: reason, natural rights (John Locke), social contract","Anglicization: colonists copied British culture & were proud Britons... for now","Zenger trial (1735): early win for freedom of the press"]]
  ],
  terms:[
    ["Jamestown","1607","First permanent English colony (Virginia), run by the Virginia Company.","Start of English America; tobacco economy."],
    ["John Rolfe & tobacco","1612","Rolfe introduced a sellable tobacco strain.","Saved Jamestown; created demand for labor → servants, then slaves."],
    ["Headright system","1618","50 acres of land for each person whose passage you paid.","Encouraged indentured servitude; made rich planters richer."],
    ["Indentured servants","1600s","Worked 4–7 years in exchange for passage to America.","Main Chesapeake labor until Bacon's Rebellion."],
    ["House of Burgesses","1619","Virginia's elected assembly; first representative government in America.","Start of colonial self-government."],
    ["Mayflower Compact","1620","Pilgrims' agreement to form a government and follow its laws.","Early example of self-government by consent."],
    ["John Winthrop / 'City upon a Hill'","1630","Puritan leader of Massachusetts Bay who wanted a model Christian community.","Idea of America as an example to the world."],
    ["Roger Williams","1636","Banished from Massachusetts; founded Rhode Island with religious freedom and separation of church & state.","Religious tolerance; dissent in Puritan society."],
    ["Anne Hutchinson","1638","Challenged Puritan ministers; banished.","Religious dissent + challenge to women's roles."],
    ["Maryland Toleration Act","1649","Protected religious freedom for all Christians in Maryland (Catholic haven).","Early step toward religious toleration."],
    ["King Philip's War","1675–76","Metacom (King Philip) led Natives against New England settlers.","Devastated both sides; broke Native power in New England."],
    ["Bacon's Rebellion","1676","Poor Virginia farmers (incl. ex-servants) rebelled against Gov. Berkeley.","Planters switched to African slavery: a HUGE turning point."],
    ["Pueblo Revolt","1680","Popé led Pueblo uprising that drove the Spanish out of New Mexico for 12 years.","Spain later became more tolerant of Native culture."],
    ["William Penn / Pennsylvania","1681","Quaker colony with religious tolerance and fair Native relations.","Model of diversity in the Middle Colonies."],
    ["Navigation Acts","1650s–1660s","Colonial trade must use English ships and go through England.","Mercantilism in action; later resented."],
    ["Dominion of New England","1686–89","James II merged northern colonies under Gov. Andros, ending assemblies.","Colonists overthrew it; showed they valued self-rule."],
    ["Salutary neglect","c. 1690–1763","Britain loosely enforced trade laws on colonies.","Colonies got used to self-government → tension when it ended."],
    ["Middle Passage","1600s–1800s","The brutal ocean voyage of enslaved Africans to the Americas.","Part of the triangular trade."],
    ["Stono Rebellion","1739","Slave revolt in South Carolina.","Led to stricter slave codes; shows resistance."],
    ["Great Awakening","1730s–40s","Religious revival: Jonathan Edwards & George Whitefield.","Questioned authority; united colonists; foreshadows revolution."],
    ["Enlightenment / John Locke","late 1600s–1700s","Reason, natural rights (life, liberty, property), social contract.","Ideas behind the Declaration of Independence."],
    ["Zenger Trial","1735","Printer acquitted of libel because what he printed was true.","Early step toward freedom of the press."]
  ],
  timeline:[
    [1607,"Jamestown founded"],
    [1608,"French found Quebec"],
    [1619,"House of Burgesses; first Africans arrive in Virginia"],
    [1620,"Pilgrims sign the Mayflower Compact"],
    [1630,"Massachusetts Bay Colony (Winthrop)"],
    [1636,"Roger Williams founds Rhode Island"],
    [1649,"Maryland Toleration Act"],
    [1651,"First Navigation Act"],
    [1664,"English take New Amsterdam → New York"],
    [1675,"King Philip's War begins"],
    [1676,"Bacon's Rebellion"],
    [1680,"Pueblo Revolt"],
    [1681,"Pennsylvania founded"],
    [1686,"Dominion of New England"],
    [1692,"Salem Witch Trials"],
    [1735,"Zenger trial"],
    [1739,"Stono Rebellion; Great Awakening peaks"]
  ],
  hacks:[
    ["Regions in 3 words","NE = God · Middle = Grain + Variety · South = Crops + Slaves","New England is about religion, the Middle about diversity and wheat, the South about cash crops."],
    ["Bacon's → Slaves","B for Bacon, B for 'Black labor'","After Bacon's Rebellion (1676), planters shifted from indentured servants to enslaved Africans."],
    ["Puritan rebels","Roger & Anne got kicked out","Williams → Rhode Island (religious freedom). Hutchinson → banished. Puritans weren't tolerant!"],
    ["French vs. English","French = Furs & Friends · English = Farms & Families","French traded with and married into Native nations; English took land for farms."]
  ],
  chains:[
    ["Tobacco becomes profitable","Planters need lots of workers","Indentured servants flood in","Freed servants can't get good land → anger","Bacon's Rebellion (1676)","Planters switch to enslaved Africans → race-based slavery"],
    ["Britain practices salutary neglect","Colonial assemblies run their own affairs","Colonists expect self-government","After 1763, Britain tightens control","Conflict → Revolution (Unit 3!)"]
  ],
  quiz:[
    {q:"Bacon's Rebellion (1676) most directly led to:", o:["The end of the Navigation Acts","An increased reliance on enslaved African labor in the Chesapeake","The founding of Pennsylvania","Greater rights for Native Americans"], a:1, e:"Planters feared poor white servants, so they turned to enslaved Africans, a permanent labor force."},
    {q:"Which crop was the economic foundation of the Chesapeake colonies?", o:["Rice","Wheat","Tobacco","Cotton"], a:2, e:"Tobacco (thanks, John Rolfe). Rice & indigo = Carolinas. Wheat = Middle colonies. Cotton = later (1800s)."},
    {q:"Compared to English colonists, French colonists in North America were more likely to:", o:["Build large plantations","Establish trading alliances and intermarry with Native peoples","Bring large numbers of families","Use the encomienda system"], a:1, e:"The French had few settlers and relied on the fur trade, so partnerships with Natives were essential."},
    {s:"“For we must consider that we shall be as a city upon a hill. The eyes of all people are upon us.”", c:"John Winthrop, 1630", q:"Winthrop's statement best reflects which goal?", o:["Gaining wealth through tobacco","Creating a model religious community","Separating church and state","Promoting religious diversity"], a:1, e:"The Puritans wanted Massachusetts Bay to be a perfect Christian example to the world."},
    {q:"The Great Awakening of the 1730s–1740s:", o:["Strengthened the authority of established churches","Encouraged questioning of traditional authority and created shared colonial experiences","Led directly to the Pueblo Revolt","Was led by John Locke"], a:1, e:"Preachers like Whitefield traveled through many colonies; people learned they could challenge authority (churches → later, kings!)."},
    {q:"The Navigation Acts were an example of:", o:["Salutary neglect","Mercantilism","Republicanism","Popular sovereignty"], a:1, e:"Mercantilism = colonies exist to benefit the mother country. The Navigation Acts forced trade through England."},
    {q:"The policy of salutary neglect resulted in:", o:["Colonists developing a strong tradition of self-government","Britain tightly controlling colonial trade","The end of colonial legislatures","Increased taxes on the colonies"], a:0, e:"Britain looked the other way, so colonial assemblies got used to governing themselves."},
    {q:"Which colony was founded on principles of religious tolerance and was most ethnically diverse?", o:["Massachusetts Bay","Virginia","Pennsylvania","South Carolina"], a:2, e:"William Penn's Quaker colony welcomed many religions and nationalities."},
    {q:"The Pueblo Revolt of 1680 resulted in:", o:["Permanent Pueblo independence","Spanish colonizers later showing more tolerance of Native culture and religion","The English taking over New Mexico","The founding of St. Augustine"], a:1, e:"The Spanish came back about 12 years later, but they became more accommodating of Pueblo customs."},
    {q:"The headright system encouraged:", o:["Religious freedom","The importation of indentured servants","Native American land rights","The growth of cities"], a:1, e:"You got 50 acres per person you brought over, so planters imported lots of servants."},
    {q:"The Mayflower Compact is significant because it:", o:["Ended the slave trade","Was an early example of self-government","Created the Iroquois Confederacy","Established the Church of England"], a:1, e:"The Pilgrims agreed to govern themselves by majority rule, an early seed of democracy."}
  ]
},
{
  id:3, title:"Revolution & a New Nation", years:"1754–1800", weight:"10–17%", color:"--u3", emoji:"🔔",
  hook:"Britain wins a huge war, goes broke, and tries to make the colonies pay. The colonies say 'no taxation without representation,' fight a revolution, try a weak government, then write the Constitution. Big unit. Big points.",
  story:[
    "<b>The French and Indian War (1754–1763)</b> was Britain vs. France for control of North America (Natives mostly sided with France). Ben Franklin's <b>Albany Plan of Union</b> (“Join, or Die”) failed, but it was an early idea of unity. Britain won (<b>Treaty of Paris 1763</b>) and took Canada and everything east of the Mississippi... but was left with <b>massive war debt</b>.",
    "<b>Britain's new rules:</b> The <b>Proclamation of 1763</b> banned settling west of the Appalachians (after <b>Pontiac's Rebellion</b>). Then came the taxes: <b>Sugar Act</b> (1764), <b>Stamp Act</b> (1765), and <b>Townshend Acts</b> (1767). Colonists protested with boycotts, the <b>Sons of Liberty</b>, and the slogan <b>“No taxation without representation.”</b> Tensions exploded with the <b>Boston Massacre</b> (1770), the <b>Boston Tea Party</b> (1773), and Britain's punishment, the <b>Intolerable (Coercive) Acts</b> (1774).",
    "<b>Revolution!</b> Fighting started at <b>Lexington & Concord</b> (1775). Thomas Paine's <b>Common Sense</b> (1776) convinced regular people to want independence, and Jefferson wrote the <b>Declaration of Independence</b> (July 4, 1776), using Locke's ideas of natural rights. The victory at <b>Saratoga</b> (1777) convinced <b>France</b> to join (1778), and the British surrendered at <b>Yorktown</b> (1781). The <b>Treaty of Paris of 1783</b> recognized independence, with the Mississippi River as the western border.",
    "<b>First try at government: the Articles of Confederation</b> (1781) were WAY too weak: no power to tax, no national army, no executive, needed 9/13 states to pass laws and all 13 to amend. One big success: the <b>Northwest Ordinance</b> (1787), which created a process for new states and banned slavery north of the Ohio River. Then <b>Shays' Rebellion</b> (1786–87), where indebted farmers rebelled, scared leaders into fixing things.",
    "<b>The Constitution (1787):</b> The <b>Great Compromise</b> (Senate equal, House by population), the <b>Three-Fifths Compromise</b>, and a 20-year protection of the slave trade. Federalists (Hamilton, Madison, Jay: <b>The Federalist Papers</b>) battled Anti-Federalists, who demanded a <b>Bill of Rights</b> (added 1791). Under <b>Washington</b>, <b>Hamilton's financial plan</b> (national bank, assume state debts, tariffs) split the country into the first political parties: <b>Federalists vs. Democratic-Republicans</b>. Then came the Whiskey Rebellion, Jay's Treaty, Washington's <b>Farewell Address</b>, and John Adams' <b>Alien & Sedition Acts</b>, answered by the Virginia & Kentucky Resolutions. In the <b>“Revolution of 1800”</b>, power passed peacefully to Jefferson."
  ],
  concepts:[
    ["Why the Revolution happened (causes)", ["War debt from the French & Indian War → Britain ends salutary neglect and taxes colonies","Colonists believe only their own assemblies can tax them (no virtual representation)","Enlightenment ideas (Locke) + Great Awakening (question authority)","Proclamation of 1763 blocks westward land","Escalation: acts → protests → violence → war"]],
    ["Why the Patriots won", ["French alliance after Saratoga (money, navy, troops)","Fighting on home turf; Britain far away","George Washington's leadership & persistence","Britain fighting a global war"]],
    ["Articles of Confederation: weak by design", ["No power to tax (asked states for money)","No national army, no president, no national courts","Couldn't regulate trade between states","Laws needed 9/13; amendments needed 13/13","Successes: won the war, Land Ordinance of 1785, Northwest Ordinance 1787"]],
    ["The Constitution's compromises", ["Great (Connecticut) Compromise: bicameral Congress (Virginia Plan + New Jersey Plan)","Three-Fifths Compromise: enslaved people count as 3/5 for representation & taxes","Slave trade could not be banned until 1808","Separation of powers + checks and balances + federalism","Electoral College"]],
    ["Federalists vs. Democratic-Republicans", ["Federalists (Hamilton, Adams): strong national gov, loose construction, national bank, merchants & manufacturing, pro-Britain","Democratic-Republicans (Jefferson, Madison): states' rights, strict construction, farmers, anti-bank, pro-France","Big fight: is a national bank constitutional? (Elastic / necessary & proper clause)"]],
    ["Early foreign policy", ["Neutrality Proclamation (1793): stay out of the France-Britain war","Jay's Treaty (1794): avoided war with Britain, but unpopular","Pinckney's Treaty (1795): Spain gives use of the Mississippi & New Orleans","Washington's Farewell (1796): avoid permanent alliances & political parties","XYZ Affair (1797) → Quasi-War with France"]]
  ],
  terms:[
    ["French and Indian War","1754–1763","Britain vs. France (and Native allies) for control of North America.","Britain wins but has huge debt → taxes colonies."],
    ["Albany Plan of Union","1754","Franklin's plan to unite the colonies for defense ('Join, or Die').","Rejected, but an early idea of colonial unity."],
    ["Treaty of Paris 1763","1763","Ended the F&I War; France lost its North American empire.","Britain dominates; Natives lose their French ally."],
    ["Pontiac's Rebellion","1763","Native uprising against British in the Ohio Valley.","Led to the Proclamation of 1763."],
    ["Proclamation of 1763","1763","Banned colonial settlement west of the Appalachians.","Angered colonists who fought for that land."],
    ["Stamp Act","1765","Direct tax on paper goods (newspapers, legal documents).","Huge protests: Stamp Act Congress, Sons of Liberty, boycotts. Repealed 1766."],
    ["Declaratory Act","1766","Parliament says it can make laws for the colonies 'in all cases whatsoever.'","Britain insists on its authority even while repealing the Stamp Act."],
    ["Townshend Acts","1767","Taxes on imported glass, paint, paper, tea.","Boycotts; John Dickinson's 'Letters from a Farmer.'"],
    ["Boston Massacre","1770","British soldiers killed 5 colonists in Boston.","Patriot propaganda (Paul Revere's engraving)."],
    ["Boston Tea Party","1773","Sons of Liberty dumped British tea in protest of the Tea Act.","Britain responds with the Intolerable Acts."],
    ["Intolerable (Coercive) Acts","1774","Closed Boston Harbor, limited MA government.","Led to the First Continental Congress."],
    ["Lexington & Concord","1775","First battles of the Revolution ('shot heard round the world').","War begins."],
    ["Olive Branch Petition","1775","Second Continental Congress's last peace offer to King George III.","He rejected it → independence more likely."],
    ["Common Sense","1776","Thomas Paine's pamphlet arguing for independence in plain language.","Turned public opinion toward independence."],
    ["Declaration of Independence","July 4, 1776","Jefferson's document: natural rights, consent of the governed, grievances vs. the King.","Based on Locke; a standard later groups used to demand equality."],
    ["Battle of Saratoga","1777","Major American victory in New York.","TURNING POINT: convinced France to ally with the U.S. (1778)."],
    ["Yorktown","1781","British General Cornwallis surrendered to Washington (+ French).","Effectively ends the war."],
    ["Treaty of Paris 1783","1783","Britain recognizes U.S. independence; border at the Mississippi.","Official end of the Revolution."],
    ["Republican Motherhood","1780s–90s","Idea that women should raise virtuous citizens for the republic.","Expanded women's education but kept them in the home."],
    ["Articles of Confederation","1781–1789","First U.S. government: weak central power.","Its failures led to the Constitution."],
    ["Northwest Ordinance","1787","Process for territories to become states; banned slavery in the Northwest Territory.","Biggest success of the Articles; Ohio River = free/slave line."],
    ["Shays' Rebellion","1786–87","Massachusetts farmers rebelled over debts & taxes.","Showed the Articles were too weak → Constitutional Convention."],
    ["Great Compromise","1787","Bicameral Congress: Senate equal (2 per state), House by population.","Solved big state vs. small state conflict."],
    ["Three-Fifths Compromise","1787","Enslaved people counted as 3/5 of a person for representation.","Gave the South extra power in Congress."],
    ["Federalist Papers","1787–88","Essays by Hamilton, Madison & Jay supporting ratification. #10: a large republic controls factions.","Helped ratify the Constitution."],
    ["Anti-Federalists","1787–88","Opposed the Constitution; feared strong central gov; demanded a Bill of Rights.","Led to the Bill of Rights."],
    ["Bill of Rights","1791","First 10 amendments protecting individual rights.","The Anti-Federalists' big win."],
    ["Hamilton's Financial Plan","1790–91","Assume state debts, national bank, tariffs, excise taxes.","Built U.S. credit; created the first party split."],
    ["Whiskey Rebellion","1794","Farmers revolted against the whiskey tax; Washington sent troops.","Showed the new government's strength (vs. Shays')."],
    ["Jay's Treaty","1794","Treaty with Britain; avoided war but few gains.","Unpopular; deepened party divisions."],
    ["Pinckney's Treaty","1795","Spain grants U.S. use of the Mississippi River and New Orleans.","Big win for western farmers."],
    ["Washington's Farewell Address","1796","Warned against permanent foreign alliances and political parties.","Guided U.S. foreign policy (isolationism) for over a century."],
    ["XYZ Affair","1797","French officials demanded bribes from U.S. diplomats.","Led to the Quasi-War with France."],
    ["Alien and Sedition Acts","1798","Federalist laws limiting immigrants and criticism of the government.","Seen as violating free speech."],
    ["Virginia & Kentucky Resolutions","1798","Jefferson & Madison argued states could nullify unconstitutional laws.","Root of states' rights / nullification theory (→ Unit 4–5)."],
    ["Election of 1800","1800","Jefferson defeats Adams: 'Revolution of 1800.'","First peaceful transfer of power between parties."]
  ],
  timeline:[
    [1754,"French and Indian War begins; Albany Plan"],
    [1763,"Treaty of Paris; Pontiac's Rebellion; Proclamation of 1763"],
    [1764,"Sugar Act"],
    [1765,"Stamp Act & Stamp Act Congress"],
    [1766,"Declaratory Act"],
    [1767,"Townshend Acts"],
    [1770,"Boston Massacre"],
    [1773,"Tea Act & Boston Tea Party"],
    [1774,"Intolerable Acts; First Continental Congress"],
    [1775,"Lexington & Concord; Second Continental Congress"],
    [1776,"Common Sense; Declaration of Independence"],
    [1777,"Battle of Saratoga"],
    [1778,"French alliance"],
    [1781,"Yorktown; Articles of Confederation ratified"],
    [1783,"Treaty of Paris: independence"],
    [1786,"Shays' Rebellion begins"],
    [1787,"Constitutional Convention; Northwest Ordinance"],
    [1789,"Washington becomes president"],
    [1791,"Bill of Rights ratified; First Bank of the U.S."],
    [1794,"Whiskey Rebellion; Jay's Treaty"],
    [1796,"Washington's Farewell Address"],
    [1798,"Alien & Sedition Acts; VA & KY Resolutions"],
    [1800,"Jefferson elected"]
  ],
  hacks:[
    ["British acts in order (1764–1774)","Some Silly Dogs Took My Tasty Ice cream","Sugar (1764) → Stamp (1765) → Declaratory (1766) → Townshend (1767) → Massacre (1770) → Tea Party (1773) → Intolerable (1774)."],
    ["Saratoga = turning point","SARAtoga brought FRAnce","The win at Saratoga convinced France to join, and France's help won the war."],
    ["Articles' weaknesses","'No TAX, No MAX'","No power to TAX, no MAXimum authority (no president, no army, no courts). Basically all bark, no bite."],
    ["Hamilton vs. Jefferson","Hamilton = Hat & factory · Jefferson = farmer & Field","Hamilton: banks, cities, strong gov, loose reading. Jefferson: farmers, states' rights, strict reading."],
    ["Shays vs. Whiskey","Shays = Shows weakness · Whiskey = Wins with strength","Under the Articles, the gov couldn't stop Shays. Under the Constitution, Washington crushed the Whiskey Rebellion."]
  ],
  chains:[
    ["French & Indian War","Britain wins but has massive debt","Britain ends salutary neglect & taxes colonies (Stamp Act, etc.)","Colonists protest: 'No taxation without representation'","Violence: Boston Massacre, Tea Party → Intolerable Acts","Lexington & Concord → Revolution"],
    ["Articles of Confederation are weak","Government can't tax or pay debts; states fight over trade","Shays' Rebellion (1786–87) and the gov can't stop it","Leaders call the Constitutional Convention (1787)","Stronger federal government created"],
    ["Hamilton proposes a national bank","Jefferson says it's unconstitutional (strict construction)","Hamilton says it's 'necessary and proper' (loose construction)","First political parties form: Federalists vs. Democratic-Republicans"]
  ],
  quiz:[
    {q:"The main reason Britain changed its colonial policy after 1763 was:", o:["To punish the colonies for the Boston Tea Party","To pay off debt from the French and Indian War","To support the French","To end slavery in the colonies"], a:1, e:"War debt! The war was expensive, and Britain thought the colonists should help pay for their own defense."},
    {q:"The Proclamation of 1763 angered colonists because it:", o:["Taxed paper goods","Prohibited settlement west of the Appalachian Mountains","Closed Boston Harbor","Required colonists to house soldiers"], a:1, e:"Colonists fought the war partly for western land, then Britain banned settling it (to avoid more Native wars)."},
    {s:"“It is inseparably essential to the freedom of a people… that no taxes be imposed on them but with their own consent, given personally or by their representatives.”", c:"Stamp Act Congress, Declaration of Rights and Grievances, 1765", q:"This statement most directly reflects the colonists' belief that:", o:["Parliament should have no authority over the colonies at all","Only colonial assemblies had the right to tax the colonists","The colonies should immediately declare independence","Virtual representation was acceptable"], a:1, e:"'No taxation without representation.' In 1765, they still saw themselves as British but rejected Parliament's right to TAX them. Independence came later."},
    {q:"The American victory at Saratoga (1777) was significant because it:", o:["Ended the Revolutionary War","Convinced France to form an alliance with the United States","Led to the writing of the Declaration of Independence","Forced Britain to repeal the Stamp Act"], a:1, e:"Saratoga proved the Americans could win, and France joined in 1778. Yorktown ended the war in 1781."},
    {q:"Thomas Paine's Common Sense (1776) was influential mainly because it:", o:["Proposed the Articles of Confederation","Used plain language to persuade ordinary colonists to support independence","Called for reconciliation with Britain","Argued for a strong national bank"], a:1, e:"Written for regular people, it sold hundreds of thousands of copies and attacked the idea of kings."},
    {q:"Which was the most significant weakness of the Articles of Confederation?", o:["The president had too much power","Congress could not levy taxes","It created too many federal courts","It allowed slavery in the Northwest Territory"], a:1, e:"No power to tax = no money to pay debts or soldiers. (Also: there was no president at all!)"},
    {q:"Shays' Rebellion (1786–87) most directly contributed to:", o:["The French alliance","The calling of the Constitutional Convention","The Whiskey Rebellion","The Declaration of Independence"], a:1, e:"It scared elites: the weak national government couldn't stop it. So they met in Philadelphia in 1787."},
    {q:"The Northwest Ordinance of 1787:", o:["Allowed slavery in all new territories","Banned slavery in the Northwest Territory and set up a process for statehood","Gave the land back to Native Americans","Created the national bank"], a:1, e:"Its biggest legacy: no slavery north of the Ohio River, plus a model for adding new states as equals."},
    {q:"The Great Compromise resolved a dispute over:", o:["Slavery in the territories","Representation in Congress between large and small states","Whether to have a national bank","Taxes on imports"], a:1, e:"Big states (Virginia Plan) wanted population-based seats; small states (NJ Plan) wanted equal. Result: both, with a House and a Senate."},
    {s:"“The smaller the society, the fewer probably will be the distinct parties and interests… Extend the sphere, and you take in a greater variety of parties and interests.”", c:"James Madison, Federalist No. 10, 1787", q:"Madison's argument supported which idea?", o:["A small republic is the safest form of government","A large republic would prevent any one faction from dominating","States should have more power than the national government","The Articles of Confederation should be kept"], a:1, e:"Federalist #10: in a big country, so many factions compete that none can take over."},
    {q:"Thomas Jefferson opposed Hamilton's national bank mainly because he believed:", o:["The Constitution did not specifically give Congress that power","Banks would help farmers too much","It would weaken ties with Britain","It would end the Whiskey Tax"], a:0, e:"Strict construction: if the Constitution doesn't say it, the government can't do it. Hamilton used the 'necessary and proper' clause (loose construction)."},
    {q:"In his Farewell Address, Washington warned Americans to:", o:["Form a permanent alliance with France","Avoid permanent foreign alliances and the dangers of political parties","Expand west of the Mississippi","Abolish slavery"], a:1, e:"Stay neutral and avoid factions. This shaped U.S. isolationism for a long time."},
    {q:"The Virginia and Kentucky Resolutions were a response to:", o:["The Stamp Act","The Alien and Sedition Acts","Jay's Treaty","The Whiskey Rebellion"], a:1, e:"Jefferson & Madison argued states could declare federal laws unconstitutional, the root of later nullification."},
    {q:"The Election of 1800 is called a 'revolution' because:", o:["It involved armed conflict","Power transferred peacefully from one political party to another","Women gained the right to vote","It ended the Federalist Papers"], a:1, e:"Federalist Adams handed power to Democratic-Republican Jefferson without violence, which was rare in the world at the time."}
  ]
},
{
  id:4, title:"The Early Republic & Jacksonian Era", years:"1800–1848", weight:"10–17%", color:"--u4", emoji:"🚂",
  hook:"The country doubles in size, the Supreme Court gets powerful, the economy is rewired by canals and factories, the 'common man' gets the vote, and reformers try to fix everything, while slavery spreads with cotton.",
  story:[
    "<b>Jefferson</b> wanted a small government but bought the <b>Louisiana Purchase</b> (1803) from Napoleon, doubling the country, even though the Constitution didn't clearly allow it. Lewis & Clark explored it. Meanwhile, Chief Justice <b>John Marshall</b> made the Supreme Court powerful: <b>Marbury v. Madison</b> (1803) created <b>judicial review</b>; <b>McCulloch v. Maryland</b> (1819) said the national bank was constitutional and states couldn't tax it; <b>Gibbons v. Ogden</b> (1824) said Congress controls interstate commerce.",
    "<b>The War of 1812</b> (Madison) was fought over British <b>impressment</b> of U.S. sailors and British support for Natives (like <b>Tecumseh</b>), pushed by the “War Hawks.” It ended in a tie (<b>Treaty of Ghent</b>), but Jackson's win at <b>New Orleans</b> made Americans proud. Federalists who opposed the war (<b>Hartford Convention</b>) looked like traitors and their party died.",
    "<b>The Era of Good Feelings</b> (Monroe): one party, nationalism, Henry Clay's <b>American System</b> (bank + tariff + roads/canals). But cracks appeared: the <b>Panic of 1819</b> and the fight over Missouri, solved by the <b>Missouri Compromise</b> (1820): Missouri slave, Maine free, no slavery north of <b>36°30'</b>. The <b>Monroe Doctrine</b> (1823) told Europe: no new colonies in the Americas.",
    "<b>The Market Revolution</b> rewired the economy: the <b>Erie Canal</b> (1825), steamboats, railroads, the telegraph. The North built factories (<b>Lowell mill girls</b>, interchangeable parts), the West grew food (John Deere's plow, McCormick's reaper), and the South grew cotton thanks to Eli Whitney's <b>cotton gin</b> (1793), which <i>expanded</i> slavery massively. Irish and German immigrants poured in, sparking <b>nativism</b>.",
    "<b>Jacksonian Democracy:</b> After the 1824 “<b>corrupt bargain</b>,” Andrew Jackson won in 1828 as the champion of the common man: voting expanded to <b>all white men</b> (property requirements dropped), along with the <b>spoils system</b>. He signed the <b>Indian Removal Act</b> (1830) and ignored <b>Worcester v. Georgia</b>, leading to the <b>Trail of Tears</b> (1838). He crushed South Carolina in the <b>Nullification Crisis</b> (over the Tariff of Abominations) and killed the <b>Second Bank</b> (Bank War), which helped cause the <b>Panic of 1837</b>. Opponents formed the <b>Whig Party</b> → the Second Party System.",
    "<b>The Second Great Awakening</b> (Charles Finney) inspired a wave of <b>reform</b>: temperance, <b>abolition</b> (William Lloyd Garrison's <i>Liberator</i>, Frederick Douglass), <b>women's rights</b> (<b>Seneca Falls</b>, 1848), asylums (Dorothea Dix), public schools (Horace Mann), utopian communities, and <b>Transcendentalism</b> (Emerson, Thoreau). In the South, Nat Turner's Rebellion (1831) made slave codes even harsher."
  ],
  concepts:[
    ["The Marshall Court (federal power ↑)", ["Marbury v. Madison (1803): judicial review","Fletcher v. Peck (1810): courts can strike down state laws; contracts protected","McCulloch v. Maryland (1819): implied powers; national bank OK; states can't tax it","Gibbons v. Ogden (1824): Congress regulates interstate commerce","Worcester v. Georgia (1832): Cherokee are a sovereign nation, Georgia's laws don't apply (Jackson ignored it)"]],
    ["Nationalism after 1812", ["Era of Good Feelings (Monroe, one party)","American System (Clay): Second Bank, protective tariff (1816), internal improvements","Adams-Onís Treaty (1819): Spain gives Florida","Monroe Doctrine (1823): no new European colonies in the Western Hemisphere"]],
    ["Market Revolution", ["Transportation: National Road, Erie Canal (1825), steamboats, railroads","Communication: telegraph (Morse, 1844)","North: factories, wage labor, Lowell system, interchangeable parts","West: commercial farming (Deere plow, McCormick reaper)","South: cotton gin → 'King Cotton' → slavery expands west","Regions become economically linked but socially different"]],
    ["Jacksonian Democracy", ["Universal white male suffrage; party conventions; spoils system","Indian Removal Act (1830) → Trail of Tears (1838)","Nullification Crisis (1832–33): SC vs. Tariff; Force Bill + Compromise Tariff","Bank War: vetoed recharter (1832), moved funds to 'pet banks'","Second Party System: Democrats (Jackson) vs. Whigs (Clay, Webster)"]],
    ["Reform era (from the Second Great Awakening)", ["Temperance (anti-alcohol)","Abolition: gradual (American Colonization Society) → immediate (Garrison, Douglass, the Grimké sisters)","Women's rights: Seneca Falls 1848, Declaration of Sentiments (Stanton, Mott)","Asylums & prisons: Dorothea Dix · Public schools: Horace Mann","Utopias (Brook Farm, Oneida, Shakers) & Mormons","Transcendentalism: Emerson, Thoreau ('Civil Disobedience')"]],
    ["The South & slavery", ["Cotton = top U.S. export","Most white Southerners didn't own slaves, but the planter elite dominated politics","Domestic slave trade moved enslaved people west, breaking families","Resistance: Denmark Vesey (1822), Nat Turner (1831)","Defense of slavery shifted from 'necessary evil' to 'positive good' (Calhoun)","Gag rule (1836) blocked anti-slavery petitions in Congress"]]
  ],
  terms:[
    ["Marbury v. Madison","1803","Supreme Court case establishing judicial review.","Courts can strike down unconstitutional laws: huge power."],
    ["Louisiana Purchase","1803","Jefferson bought the Louisiana Territory from France for $15 million.","Doubled the U.S.; contradicted Jefferson's strict construction."],
    ["Lewis and Clark","1804–06","Expedition to explore the Louisiana Territory (with Sacagawea).","Mapped the West; boosted claims to Oregon."],
    ["Embargo Act","1807","Jefferson banned all trade with foreign nations.","Backfired: hurt the U.S. economy, especially New England."],
    ["Tecumseh","1811","Shawnee leader who tried to unite Natives against U.S. expansion.","Defeated; British support for Natives helped cause the War of 1812."],
    ["War of 1812","1812–1815","U.S. vs. Britain over impressment, trade, and Native conflicts.","Boosted nationalism & manufacturing; killed the Federalists."],
    ["Hartford Convention","1814","New England Federalists met to oppose the war.","Seen as unpatriotic → Federalist Party collapsed."],
    ["Treaty of Ghent","1814","Ended the War of 1812, with no territory changes.","'Status quo' peace."],
    ["Era of Good Feelings","1817–1825","Monroe's presidency; one party, strong nationalism.","Hid growing sectional tensions."],
    ["American System","1810s–20s","Henry Clay's plan: national bank, protective tariff, internal improvements.","Tied the regions together economically."],
    ["McCulloch v. Maryland","1819","States can't tax the national bank; Congress has implied powers.","Federal gov is supreme over the states."],
    ["Panic of 1819","1819","First major U.S. financial crisis.","Hurt farmers; anger at the national bank."],
    ["Missouri Compromise","1820","Missouri = slave, Maine = free; no slavery north of 36°30' in the Louisiana Territory.","Temporarily kept the Senate balance; showed sectional danger."],
    ["Monroe Doctrine","1823","Europe must not colonize or interfere in the Western Hemisphere.","Foundation of U.S. foreign policy in Latin America."],
    ["Gibbons v. Ogden","1824","Congress controls interstate commerce.","Boosted national economic power."],
    ["Corrupt Bargain","1824","House picked J.Q. Adams; Clay became Secretary of State.","Jackson fans furious → Jackson wins 1828."],
    ["Erie Canal","1825","Canal linking the Great Lakes to New York City.","Made NYC the top port; boosted the Market Revolution."],
    ["Cotton gin","1793","Eli Whitney's machine to separate cotton seeds.","Made cotton super profitable → slavery EXPANDED."],
    ["Lowell System","1820s–40s","Textile mills employing young New England women.","Early factory system; women in the workforce."],
    ["Jacksonian Democracy","1828–1840","Expanded voting to all white men; the 'common man' in politics.","Democracy expanded, but not for women, Black people or Natives."],
    ["Spoils system","1829","Giving government jobs to party supporters.","Rewarded loyalty; later led to corruption."],
    ["Indian Removal Act","1830","Authorized forced relocation of Native nations west of the Mississippi.","Led to the Trail of Tears."],
    ["Worcester v. Georgia","1832","Cherokee nation is sovereign; Georgia law doesn't apply.","Jackson ignored the ruling."],
    ["Trail of Tears","1838","Forced march of the Cherokee to Indian Territory; ~4,000 died.","Symbol of the cruelty of Indian removal."],
    ["Nullification Crisis","1832–33","South Carolina (Calhoun) declared the tariff void; Jackson threatened force.","States' rights vs. federal power; resolved by the Compromise Tariff of 1833."],
    ["Tariff of Abominations","1828","High protective tariff that hurt the South.","Triggered the Nullification Crisis."],
    ["Bank War","1832","Jackson vetoed the Second Bank's recharter.","Led to the Panic of 1837 and the Whig Party."],
    ["Whig Party","1834","Party opposing 'King Andrew' Jackson; Clay & Webster.","Created the Second Party System."],
    ["Panic of 1837","1837","Economic depression after the bank fight & land speculation.","Hurt Van Buren; Whigs win in 1840."],
    ["Second Great Awakening","1800–1840s","Religious revival: Charles Finney; individuals can save themselves and society.","Fueled ALL the reform movements."],
    ["William Lloyd Garrison","1831","Radical abolitionist; published The Liberator.","Pushed for immediate abolition."],
    ["Frederick Douglass","1845","Escaped slave, abolitionist, author of his Narrative.","Powerful voice proving slavery's brutality."],
    ["Nat Turner's Rebellion","1831","Violent slave revolt in Virginia.","South passed harsher slave codes."],
    ["Seneca Falls Convention","1848","First women's rights convention; Declaration of Sentiments (Stanton, Mott).","Start of the organized women's suffrage movement."],
    ["Dorothea Dix","1840s","Reformer for better treatment of the mentally ill.","Asylum reform."],
    ["Horace Mann","1830s–40s","Pushed for free public education in Massachusetts.","Common school movement."],
    ["Transcendentalism","1830s–40s","Emerson & Thoreau: truth through nature and the individual.","Thoreau's 'Civil Disobedience' later inspired Gandhi & MLK."],
    ["Nativism / Know-Nothings","1840s–50s","Anti-immigrant (especially anti-Irish Catholic) movement.","Reaction to mass Irish & German immigration."]
  ],
  timeline:[
    [1793,"Eli Whitney invents the cotton gin"],
    [1803,"Louisiana Purchase; Marbury v. Madison"],
    [1804,"Lewis & Clark expedition begins"],
    [1807,"Embargo Act"],
    [1812,"War of 1812 begins"],
    [1814,"Hartford Convention; Treaty of Ghent"],
    [1815,"Battle of New Orleans"],
    [1816,"Second Bank of the U.S.; Tariff of 1816"],
    [1819,"McCulloch v. Maryland; Panic of 1819; Adams-Onís Treaty"],
    [1820,"Missouri Compromise"],
    [1823,"Monroe Doctrine"],
    [1824,"'Corrupt Bargain' election; Gibbons v. Ogden"],
    [1825,"Erie Canal completed"],
    [1828,"Jackson elected; Tariff of Abominations"],
    [1830,"Indian Removal Act"],
    [1831,"Nat Turner's Rebellion; The Liberator begins"],
    [1832,"Bank veto; Nullification Crisis; Worcester v. Georgia"],
    [1837,"Panic of 1837"],
    [1838,"Trail of Tears"],
    [1844,"Telegraph (Morse)"],
    [1848,"Seneca Falls Convention"]
  ],
  hacks:[
    ["Marshall's power moves","'MMG': Marbury Makes judges Mighty · McCulloch Means feds win · Gibbons Governs commerce","All three cases made the national government (and the Court) stronger."],
    ["Clay's American System","B-T-I: Bank, Tariff, Improvements","Henry Clay wanted the regions linked: Northern factories, Western food, roads and canals to connect them."],
    ["Missouri Compromise math","M + M + 36°30'","Missouri (slave) + Maine (free) + a line at 36°30'. Keeps the Senate even: 12 free vs. 12 slave."],
    ["Jackson's 'B-I-N' fights","Bank · Indians · Nullification","Jackson's three biggest battles: killed the Bank, forced Indian Removal, and crushed Nullification."],
    ["Reform = 'TAWE'","Temperance · Abolition · Women · Education (+ asylums)","All sparked by the Second Great Awakening: 'if you can perfect yourself, you can perfect society.'"]
  ],
  chains:[
    ["Eli Whitney's cotton gin (1793)","Cleaning cotton becomes fast & cheap","Cotton becomes hugely profitable","Planters expand west and buy more enslaved people","Slavery grows instead of dying out → sectional conflict"],
    ["Second Great Awakening","Belief that people can perfect themselves & society","Reform movements: temperance, education, asylums","Abolition movement grows","Women in abolition realize they lack rights too → Seneca Falls (1848)"],
    ["Tariff of Abominations (1828)","South pays more for goods; feels exploited by the North","Calhoun's theory: states can nullify federal laws","South Carolina nullifies the tariff (1832)","Jackson threatens force (Force Bill); Clay's Compromise Tariff (1833) ends the crisis"]
  ],
  quiz:[
    {q:"Marbury v. Madison (1803) is significant because it established:", o:["The national bank","Judicial review","The power of states to nullify laws","Interstate commerce rules"], a:1, e:"Judicial review = the Supreme Court can declare laws unconstitutional."},
    {q:"Which Supreme Court case ruled that states could not tax the national bank?", o:["Gibbons v. Ogden","Worcester v. Georgia","McCulloch v. Maryland","Dred Scott v. Sandford"], a:2, e:"McCulloch v. Maryland (1819): 'the power to tax involves the power to destroy.' Federal > state."},
    {q:"The Louisiana Purchase created a dilemma for Jefferson because:", o:["He opposed westward expansion","The Constitution did not explicitly give the president power to buy land","France demanded war","It added slave states"], a:1, e:"Jefferson was a strict constructionist, but he bought it anyway. Pragmatism beat ideology."},
    {q:"The Missouri Compromise (1820):", o:["Ended slavery in the territories","Admitted Missouri as a slave state and Maine as a free state, and banned slavery north of 36°30'","Created popular sovereignty","Was declared constitutional by Dred Scott"], a:1, e:"It kept the Senate balanced. (Dred Scott later declared it unconstitutional in 1857!)"},
    {q:"The Monroe Doctrine (1823) declared that:", o:["The U.S. would help Europe in its wars","The Western Hemisphere was closed to new European colonization","The U.S. would annex Mexico","Britain could keep its Latin American colonies forever"], a:1, e:"'Europe, stay out of the Americas, and we'll stay out of Europe.'"},
    {q:"The Market Revolution of the early 1800s led most directly to:", o:["Less trade between regions","Increased economic ties between the North and West and the growth of factories","The end of slavery in the South","Fewer immigrants"], a:1, e:"Canals and railroads linked Western farms to Northern factories and cities."},
    {q:"Which most directly caused the expansion of slavery in the early 1800s?", o:["The Northwest Ordinance","The invention of the cotton gin","The Missouri Compromise","The Second Great Awakening"], a:1, e:"Cotton became super profitable, so planters wanted more land and more enslaved workers."},
    {s:"“We hold these truths to be self-evident: that all men and women are created equal…”", c:"Declaration of Sentiments, Seneca Falls Convention, 1848", q:"The authors of this document were most directly influenced by:", o:["The Federalist Papers","The Declaration of Independence and Second Great Awakening reform","The Monroe Doctrine","The Market Revolution"], a:1, e:"They copied the Declaration of Independence on purpose, and many were reformers from the abolition movement."},
    {q:"The Nullification Crisis (1832–33) centered on:", o:["South Carolina's claim that it could void a federal tariff","The national bank's recharter","The removal of the Cherokee","Slavery in Missouri"], a:0, e:"Calhoun said states could nullify laws (an idea from the VA/KY Resolutions). Jackson threatened force; a compromise tariff ended it."},
    {q:"How did President Jackson respond to Worcester v. Georgia (1832)?", o:["He enforced it with federal troops","He refused to enforce it, and Cherokee removal continued","He asked Congress to amend the Constitution","He resigned"], a:1, e:"Jackson ignored the Court → the Cherokee were forced west on the Trail of Tears (1838)."},
    {q:"'Jacksonian Democracy' primarily refers to:", o:["Voting rights for women","The expansion of voting rights to nearly all white men","The abolition of slavery","A stronger national bank"], a:1, e:"Property requirements for voting fell away, but only for white men."},
    {q:"The Second Great Awakening most directly encouraged:", o:["The Market Revolution","Reform movements like abolition and temperance","Federalist Party growth","The War of 1812"], a:1, e:"Revival preachers taught that people could improve themselves and society, so reform movements exploded."},
    {q:"The Hartford Convention (1814) contributed to:", o:["The rise of the Whig Party","The decline of the Federalist Party","The start of the War of 1812","The Era of Good Feelings ending"], a:1, e:"Federalists opposed the war; when the U.S. 'won' at New Orleans, they looked disloyal and collapsed."},
    {q:"The Whig Party formed mainly in opposition to:", o:["Thomas Jefferson","Andrew Jackson","Abraham Lincoln","John Adams"], a:1, e:"Whigs opposed 'King Andrew' Jackson's use of executive power (especially the Bank War)."}
  ]
},
{
  id:5, title:"Expansion, Civil War & Reconstruction", years:"1844–1877", weight:"10–17%", color:"--u5", emoji:"⚔️",
  hook:"America grabs land from coast to coast, and every new acre forces the question: slave or free? Compromises fail, the country splits, 620,000+ die, slavery ends, and Reconstruction tries (and partly fails) to rebuild the nation with equality.",
  story:[
    "<b>Manifest Destiny</b> (1845, John O'Sullivan) was the belief that God wanted the U.S. to spread across the continent. <b>Texas</b> was annexed (1845), Oregon was split with Britain at the 49th parallel (1846), and President <b>Polk</b> fought the <b>Mexican-American War</b> (1846–48). With the <b>Treaty of Guadalupe Hidalgo</b>, the U.S. got California and the Southwest (the Mexican Cession). Then gold was found → the <b>Gold Rush</b> (1849).",
    "<b>The problem: slavery in the new land.</b> The <b>Wilmot Proviso</b> (1846) tried to ban it in land from Mexico. It failed but split Congress by section. The <b>Compromise of 1850</b>: California free, popular sovereignty in Utah and New Mexico, no slave trade in DC, and a <b>tough Fugitive Slave Act</b> that made Northerners furious. <i>Uncle Tom's Cabin</i> (1852) turned many more Northerners against slavery.",
    "<b>Things fall apart.</b> The <b>Kansas-Nebraska Act</b> (1854, Stephen Douglas) let those territories vote on slavery (<b>popular sovereignty</b>), which repealed the Missouri Compromise line, causing <b>“Bleeding Kansas”</b> and the birth of the <b>Republican Party</b> (stop slavery's expansion). <b>Dred Scott v. Sandford</b> (1857) said Black people weren't citizens and Congress couldn't ban slavery in territories. The <b>Lincoln-Douglas Debates</b> (1858) made Lincoln famous, and <b>John Brown's raid</b> on Harpers Ferry (1859) terrified the South.",
    "<b>Lincoln wins (1860)</b> without a single Southern electoral vote → South Carolina <b>secedes</b>, others follow, and the Confederacy fires on <b>Fort Sumter</b> (1861). The North had the factories, railroads and people; the South had good generals and was fighting defensively. After <b>Antietam</b> (1862), Lincoln issued the <b>Emancipation Proclamation</b> (1863), freeing slaves in rebel states, making the war about slavery and keeping Britain and France out. <b>Gettysburg</b> and <b>Vicksburg</b> (July 1863) turned the tide; Sherman's March to the Sea (1864) destroyed the South's resources; Lee surrendered at <b>Appomattox</b> (1865). Days later, Lincoln was assassinated.",
    "<b>Reconstruction (1865–1877):</b> President <b>Andrew Johnson</b> was lenient on the South, which passed <b>Black Codes</b> to control freedpeople. <b>Radical Republicans</b> took over: the <b>13th</b> (abolished slavery), <b>14th</b> (citizenship and equal protection) and <b>15th</b> (Black men's right to vote) Amendments, the <b>Freedmen's Bureau</b>, and military rule of the South (Reconstruction Acts 1867). Johnson was <b>impeached</b> (1868) but not removed. Black men voted and held office, but the <b>KKK</b> used terror, and <b>sharecropping</b> trapped freedpeople in debt. The <b>Compromise of 1877</b> gave Hayes the presidency in exchange for pulling federal troops out of the South, ending Reconstruction."
  ],
  concepts:[
    ["Manifest Destiny & expansion", ["Texas: independence 1836 → annexed 1845","Oregon: 'Fifty-four forty or fight!' → compromise at 49° (1846)","Mexican-American War (1846–48) → Mexican Cession (CA, NV, UT, AZ, NM…)","Gadsden Purchase (1853): southern AZ/NM for a railroad","Gold Rush (1849): migration incl. Chinese immigrants; Natives in CA devastated"]],
    ["Failed compromises (road to war)", ["Wilmot Proviso (1846): failed ban on slavery in the Mexican Cession","Compromise of 1850: CA free; popular sovereignty in Utah/NM; Fugitive Slave Act","Kansas-Nebraska Act (1854): popular sovereignty, repeals the 36°30' line → Bleeding Kansas","Dred Scott (1857): no Black citizenship; Missouri Compromise unconstitutional","Election of 1860 → secession"]],
    ["New & dying parties", ["Whigs collapse after Kansas-Nebraska","Free Soil Party (1848): stop slavery's spread (to protect white free labor)","Know-Nothings: anti-immigrant","Republican Party (1854): free soil, free labor; Lincoln","Democrats split North/South in 1860"]],
    ["Civil War: why the Union won", ["North: 2/3 of the population, ~90% of the factories, most railroads, navy (Anaconda Plan blockade)","South: defensive war, strong generals (Lee), 'King Cotton diplomacy' failed","Emancipation Proclamation: war about slavery; Europe stayed out; ~200,000 Black soldiers joined (54th Massachusetts)","Lincoln expanded federal power: suspended habeas corpus, the draft (→ NYC Draft Riots 1863)","Wartime laws: Homestead Act, Pacific Railway Act, Morrill Land-Grant Act (1862)"]],
    ["Reconstruction plans", ["Lincoln: Ten Percent Plan (lenient)","Wade-Davis Bill: Congress wanted 50% loyalty oath (Lincoln pocket-vetoed it)","Johnson: lenient, pardoned ex-Confederates → Black Codes","Radical Republicans (Thaddeus Stevens, Charles Sumner): Civil Rights Act of 1866, 14th Amendment, Reconstruction Acts 1867 (5 military districts)","Johnson impeached (1868) for violating the Tenure of Office Act; acquitted by 1 vote"]],
    ["How Reconstruction ended / what remained", ["KKK & white violence; Enforcement Acts (1870–71) tried to stop them","Northern fatigue + Panic of 1873 + Grant scandals","'Redeemers' (white Democrats) retake Southern governments","Compromise of 1877: Hayes president, troops out of the South","Legacy: 13th/14th/15th Amendments stay in the Constitution (used in the Civil Rights movement), but sharecropping & later Jim Crow"]]
  ],
  terms:[
    ["Manifest Destiny","1845","Belief that the U.S. was destined by God to expand across the continent.","Justified westward expansion & the Mexican War."],
    ["Texas annexation","1845","Texas (independent since 1836) joins the U.S. as a slave state.","Led to war with Mexico."],
    ["James K. Polk","1845–49","President who achieved Texas, Oregon & the Mexican Cession.","Expansionist president."],
    ["Oregon Treaty","1846","U.S. & Britain split Oregon at the 49th parallel.","Peaceful expansion (vs. war with Mexico)."],
    ["Mexican-American War","1846–48","U.S. war with Mexico after a border dispute.","Gained a huge territory, which reopened the slavery debate."],
    ["Wilmot Proviso","1846","Proposal to ban slavery in all land won from Mexico.","Never passed but split Congress by section, not party."],
    ["Treaty of Guadalupe Hidalgo","1848","Ended the Mexican War; Mexico ceded CA & the Southwest for $15M.","Mexican Cession. Where does slavery go?"],
    ["Free Soil Party","1848","Party opposing the spread of slavery into the West.","Forerunner of the Republican Party."],
    ["California Gold Rush","1849","Gold discovery brought huge migration.","CA wanted to join as a free state → crisis."],
    ["Compromise of 1850","1850","CA free; popular sovereignty in UT/NM; DC slave trade banned; strict Fugitive Slave Act.","Delayed war 10 years; the Fugitive Slave Act angered the North."],
    ["Fugitive Slave Act","1850","Northerners required to help capture escaped slaves.","Turned many Northerners against slavery."],
    ["Uncle Tom's Cabin","1852","Harriet Beecher Stowe's anti-slavery novel.","Made Northerners emotionally oppose slavery."],
    ["Popular sovereignty","1850s","Letting the settlers of a territory vote on slavery.","Stephen Douglas's idea; caused Bleeding Kansas."],
    ["Kansas-Nebraska Act","1854","Popular sovereignty in Kansas and Nebraska; repealed the Missouri Compromise line.","Bleeding Kansas, Whig collapse, Republican Party born."],
    ["Bleeding Kansas","1855–56","Violent clashes between pro- and anti-slavery settlers.","Preview of the Civil War."],
    ["Republican Party","1854","Formed to stop the expansion of slavery ('free soil, free labor').","Elected Lincoln in 1860."],
    ["Caning of Charles Sumner","1856","Southern congressman beat an anti-slavery senator on the Senate floor.","Showed how violent sectional hatred had become."],
    ["Dred Scott v. Sandford","1857","Black people aren't citizens; Congress can't ban slavery in territories.","Missouri Compromise ruled unconstitutional; outraged the North."],
    ["Lincoln-Douglas Debates","1858","Illinois Senate debates; Douglas's Freeport Doctrine.","Made Lincoln nationally famous."],
    ["John Brown's Raid","1859","Abolitionist raid on the Harpers Ferry arsenal to start a slave revolt.","Terrified the South; a martyr in the North."],
    ["Election of 1860","1860","Lincoln (Republican) wins with no Southern electoral votes.","South Carolina secedes in December 1860."],
    ["Fort Sumter","April 1861","Confederates fire on a federal fort in South Carolina.","Civil War begins."],
    ["Anaconda Plan","1861","Union strategy: blockade the South and control the Mississippi.","Slowly strangled the Confederate economy."],
    ["Antietam","1862","Bloodiest single day of the war; a Union strategic victory.","Gave Lincoln the chance to issue the Emancipation Proclamation."],
    ["Emancipation Proclamation","Jan 1, 1863","Freed slaves in Confederate-held territory.","War becomes about slavery; Britain/France stay out; Black soldiers enlist."],
    ["Homestead Act","1862","160 acres of free western land to settlers who farmed it for 5 years.","Encouraged western settlement."],
    ["Gettysburg & Vicksburg","July 1863","Union victories: Lee's invasion stopped; the Union controls the Mississippi.","TURNING POINT of the war."],
    ["Gettysburg Address","1863","Lincoln's speech: 'a new birth of freedom.'","Redefined the war's purpose around equality."],
    ["Sherman's March to the Sea","1864","Total war through Georgia, destroying resources.","Broke Southern morale; helped Lincoln win re-election."],
    ["Appomattox Court House","April 1865","Lee surrenders to Grant.","End of the Civil War."],
    ["13th Amendment","1865","Abolished slavery.","Ended slavery everywhere in the U.S."],
    ["Freedmen's Bureau","1865","Federal agency helping freedpeople with food, schools, jobs.","Big success in education (founded Black colleges)."],
    ["Black Codes","1865–66","Southern laws restricting freedpeople's rights and labor.","Led Radical Republicans to take control."],
    ["14th Amendment","1868","Citizenship for all born in the U.S.; equal protection; due process.","Overturned Dred Scott; basis for later civil rights cases."],
    ["Radical Republicans","1860s","Congress members (Stevens, Sumner) wanting strong rights for freedpeople.","Took over Reconstruction from Johnson."],
    ["Reconstruction Acts","1867","Divided the South into 5 military districts; required ratifying the 14th Amendment.","Congressional (Radical) Reconstruction."],
    ["Johnson's impeachment","1868","House impeached Johnson for violating the Tenure of Office Act; Senate acquitted by 1 vote.","Congress vs. president power struggle."],
    ["15th Amendment","1870","Voting can't be denied by race.","Black men vote, but women excluded → split in the women's movement."],
    ["Sharecropping","1865 →","Farmers rented land and paid with a share of the crop.","Cycle of debt kept freedpeople poor and tied to the land."],
    ["Ku Klux Klan","1865 →","White supremacist terror group.","Used violence to stop Black voting; Enforcement Acts tried to fight it."],
    ["Compromise of 1877","1877","Hayes becomes president; federal troops leave the South.","END of Reconstruction → Jim Crow era begins."]
  ],
  timeline:[
    [1845,"Texas annexed; 'Manifest Destiny' coined"],
    [1846,"Mexican-American War begins; Wilmot Proviso; Oregon Treaty"],
    [1848,"Treaty of Guadalupe Hidalgo; Free Soil Party"],
    [1849,"California Gold Rush"],
    [1850,"Compromise of 1850 & Fugitive Slave Act"],
    [1852,"Uncle Tom's Cabin published"],
    [1853,"Gadsden Purchase"],
    [1854,"Kansas-Nebraska Act; Republican Party founded"],
    [1856,"Bleeding Kansas; Sumner caned"],
    [1857,"Dred Scott decision"],
    [1858,"Lincoln-Douglas Debates"],
    [1859,"John Brown's raid on Harpers Ferry"],
    [1860,"Lincoln elected; South Carolina secedes"],
    [1861,"Fort Sumter: Civil War begins"],
    [1862,"Antietam; Homestead Act"],
    [1863,"Emancipation Proclamation; Gettysburg & Vicksburg"],
    [1864,"Sherman's March to the Sea"],
    [1865,"Appomattox; Lincoln assassinated; 13th Amendment; Freedmen's Bureau"],
    [1867,"Reconstruction Acts"],
    [1868,"14th Amendment; Johnson impeached"],
    [1870,"15th Amendment"],
    [1877,"Compromise of 1877 ends Reconstruction"]
  ],
  hacks:[
    ["Reconstruction Amendments","13-14-15 = FREE · CITIZEN · VOTE","13th freed the slaves. 14th made them citizens (equal protection). 15th let Black men vote."],
    ["The road to war (in order)","'We Can Usually Keep Debates Low, Just Ending'","Wilmot (1846) → Compromise of 1850 → Uncle Tom's Cabin (1852) → Kansas-Nebraska (1854) → Dred Scott (1857) → Lincoln-Douglas (1858) → John Brown (1859) → Election of 1860."],
    ["Turning points","July 1863 = G+V","Gettysburg (East) + Vicksburg (West) in the same week. After that, the Confederacy was on defense for good."],
    ["Why emancipate?","'M-E-S': Military · Europe · Soldiers","It hurt the Southern war effort, kept Britain & France out (they had abolished slavery), and let Black men join the Union army."],
    ["1877 deal","Hayes gets the House, the South gets the troops out","The Compromise of 1877 traded the presidency for ending Reconstruction."]
  ],
  chains:[
    ["Mexican-American War","U.S. gains the Mexican Cession","Will the new land be slave or free? (Wilmot Proviso)","Compromise of 1850 → Fugitive Slave Act angers the North","Kansas-Nebraska Act → Bleeding Kansas","Republican Party → Lincoln elected → Secession → Civil War"],
    ["Union victory & the 13th Amendment","Andrew Johnson's lenient plan","Southern states pass Black Codes","Radical Republicans take over: 14th Amendment, military Reconstruction","KKK violence & Northern fatigue","Compromise of 1877: troops leave → Jim Crow"]
  ],
  quiz:[
    {s:"“…the fulfillment of our manifest destiny to overspread the continent allotted by Providence for the free development of our yearly multiplying millions.”", c:"John O'Sullivan, 1845", q:"The idea expressed in this passage was most directly used to justify:", o:["The abolition of slavery","U.S. territorial expansion, including the war with Mexico","Isolation from world affairs","The Monroe Doctrine's creation"], a:1, e:"Manifest Destiny = God wants us to expand. It was used to justify Texas, Oregon, and the Mexican War."},
    {q:"The Wilmot Proviso (1846) was significant because it:", o:["Ended the Mexican-American War","Divided Congress along sectional lines over slavery in new territories","Created the Republican Party","Banned the slave trade in DC"], a:1, e:"It never passed, but votes split North vs. South instead of by party, a danger sign."},
    {q:"Which part of the Compromise of 1850 most angered Northerners?", o:["California's admission as a free state","The Fugitive Slave Act","Banning the slave trade in Washington, D.C.","Popular sovereignty in Utah"], a:1, e:"Northerners were forced to help catch escaped slaves, bringing slavery to their doorstep."},
    {q:"The Kansas-Nebraska Act (1854) led most directly to:", o:["The Missouri Compromise","Violence in Kansas and the formation of the Republican Party","The end of the Mexican War","The Emancipation Proclamation"], a:1, e:"Popular sovereignty brought armed settlers into Kansas → Bleeding Kansas. The Whigs split, and the Republicans formed."},
    {q:"In Dred Scott v. Sandford (1857), the Supreme Court ruled that:", o:["Slavery was unconstitutional","African Americans were not citizens and Congress could not ban slavery in the territories","Popular sovereignty was illegal","Kansas must be a free state"], a:1, e:"The Missouri Compromise was ruled unconstitutional. Northerners were outraged, and it boosted the Republicans."},
    {q:"Which was a major advantage of the Union during the Civil War?", o:["Better military leadership at the start","Fighting a defensive war on home ground","Greater industrial capacity and railroad network","Support from Great Britain"], a:2, e:"Factories, railroads, population. The South's advantages were defense and strong early generals."},
    {q:"The Emancipation Proclamation (1863):", o:["Freed all enslaved people in the United States","Freed enslaved people only in areas in rebellion against the Union","Was passed as a constitutional amendment","Ended the Civil War"], a:1, e:"It didn't apply to loyal border states. Ending slavery everywhere took the 13th Amendment (1865)."},
    {q:"Which goal did the Emancipation Proclamation help achieve internationally?", o:["Gaining French military support","Discouraging Britain and France from supporting the Confederacy","Ending the Monroe Doctrine","Purchasing Alaska"], a:1, e:"Britain had abolished slavery, so once the war was about freedom, supporting the South became politically impossible."},
    {q:"The 14th Amendment (1868):", o:["Abolished slavery","Granted citizenship and equal protection of the laws to all persons born in the U.S.","Gave women the right to vote","Prohibited race-based voting restrictions"], a:1, e:"13 = free, 14 = citizen + equal protection, 15 = vote."},
    {q:"Black Codes passed in Southern states after the Civil War were intended to:", o:["Protect freedpeople's voting rights","Restrict the freedom and labor of African Americans","Provide land to freedpeople","Ratify the 13th Amendment"], a:1, e:"They tried to recreate slavery-like control, which pushed the Radical Republicans to take charge."},
    {q:"Sharecropping in the South after the Civil War resulted in:", o:["Widespread land ownership for freedpeople","A cycle of debt that limited economic opportunity for many Black and poor white farmers","The rapid industrialization of the South","The end of cotton farming"], a:1, e:"Farmers owed crops and credit to landowners, so they could rarely get out of debt."},
    {q:"The Compromise of 1877:", o:["Started Radical Reconstruction","Ended Reconstruction by withdrawing federal troops from the South","Admitted California as a free state","Created the Freedmen's Bureau"], a:1, e:"Hayes got the presidency; the South got 'home rule.' Protections for Black Southerners collapsed."},
    {q:"Radical Republicans in Congress during Reconstruction generally sought to:", o:["Quickly restore former Confederates to power","Protect the civil rights of freedpeople and punish the South","Support Andrew Johnson's lenient plan","Repeal the 13th Amendment"], a:1, e:"They passed the Civil Rights Act of 1866, the 14th & 15th Amendments, and the Reconstruction Acts, and impeached Johnson."},
    {q:"The Homestead Act (1862) encouraged:", o:["Factory growth in the North","Settlement of the West by offering free land to farmers","Immigration restrictions","Southern secession"], a:1, e:"160 free acres if you lived on and farmed the land for 5 years."}
  ]
}
];

/* =========================================================
   MEDIA: public-domain images from Wikimedia Commons
   ========================================================= */
const IMG = {
  taos:["Taos Pueblo2.jpg","Taos Pueblo, New Mexico: adobe homes people have lived in for about 1,000 years","🏜️"],
  cahokia:["Monks Mound in July.JPG","Monks Mound at Cahokia (Illinois): the largest earthwork in North America","⛰️"],
  columbus:["Landing of Columbus (2).jpg","Landing of Columbus, John Vanderlyn (1847)","⛵"],
  smallpox:["FlorentineCodex BK12 F54 smallpox.jpg","Aztec drawing of smallpox victims, Florentine Codex (1500s)","🦠"],
  cortes:["Retrato de Hernán Cortés.jpg","Hernán Cortés, conqueror of the Aztec Empire","⚔️"],
  lascasas:["Bartolomé de las Casas.jpg","Bartolomé de Las Casas, defender of Native rights","✝️"],
  mayflower:["Mayflower in Plymouth Harbor, by William Halsall.jpg","Mayflower in Plymouth Harbor, William Halsall (1882)","🚢"],
  compact:["The Mayflower Compact 1620 cph.3g07155.jpg","The Mayflower Compact, 1620, painted by Jean Leon Gerome Ferris (1899)","✍️"],
  penn:["Treaty of Penn with Indians by Benjamin West.jpg","Penn's Treaty with the Indians, Benjamin West (1771–72)","🤝"],
  salem:["Martha Corey and Persecutors.JPG","Martha Corey and her accusers: Salem witch trials (1692), 19th-century illustration","🧙"],
  whitefield:["George Whitefield preaching.jpg","George Whitefield preaching during the Great Awakening","⛪"],
  slaveship:["Slaveshipposter.jpg","The slave ship Brookes, an abolitionist diagram (1788)","⛓️"],
  joinordie:["Benjamin Franklin - Join or Die.jpg","“Join, or Die.” Benjamin Franklin's cartoon (1754)","🐍"],
  massacre:["Boston Massacre high-res.jpg","The Bloody Massacre in King Street, Paul Revere's engraving (1770)","💥"],
  teaparty:["Boston Tea Party w.jpg","The Destruction of Tea at Boston Harbor, Nathaniel Currier (1846)","🫖"],
  commonsense:["Commonsense.jpg","Title page of Common Sense by Thomas Paine (1776)","📰"],
  paine:["Thomas Paine rev1.jpg","Thomas Paine","✒️"],
  writingdecl:["Writing the Declaration of Independence 1776 cph.3g09904.jpg","Franklin, Adams & Jefferson writing the Declaration, J.L.G. Ferris (1900)","📝"],
  declaration:["Declaration of Independence (1819), by John Trumbull.jpg","Declaration of Independence, John Trumbull (1819)","📜"],
  delaware:["Washington Crossing the Delaware by Emanuel Leutze, MMA-NYC, 1851.jpg","Washington Crossing the Delaware, Emanuel Leutze (1851)","🛶"],
  cornwallis:["Surrender of Lord Cornwallis.jpg","Surrender of Lord Cornwallis at Yorktown, John Trumbull (1820)","🏳️"],
  constitution:["Scene at the Signing of the Constitution of the United States.jpg","Signing of the Constitution, Howard Chandler Christy (1940)","🏛️"],
  washington:["Gilbert Stuart Williamstown Portrait of George Washington.jpg","George Washington, Gilbert Stuart (1797)","🎖️"],
  hamilton:["Alexander Hamilton portrait by John Trumbull 1806.jpg","Alexander Hamilton, John Trumbull (1806)","💵"],
  jefferson:["Official Presidential portrait of Thomas Jefferson (by Rembrandt Peale, 1800).jpg","Thomas Jefferson, Rembrandt Peale (1800)","🌾"],
  lewisclark:["Lewis and clark-expedition.jpg","Lewis and Clark on the Lower Columbia, Charles M. Russell (1905)","🧭"],
  tecumseh:["Tecumseh02.jpg","Tecumseh, Shawnee leader","🪶"],
  marshall:["John Marshall by Henry Inman, 1832.jpg","Chief Justice John Marshall, Henry Inman (1832)","⚖️"],
  missouri:["Missouri Compromise Line.svg","Map: the Missouri Compromise line at 36°30' (1820)","🗺️"],
  cottongin:["Cotton gin harpers.jpg","Enslaved people using a cotton gin, Harper's Weekly (1869)","⚙️"],
  clay:["Henry Clay.JPG","Henry Clay, 'the Great Compromiser'","🤝"],
  jackson:["Andrew Jackson.jpg","Andrew Jackson, 7th president","🎩"],
  calhoun:["John C Calhoun by Mathew Brady, 1849.jpg","John C. Calhoun, photographed by Mathew Brady (1849)","✋"],
  trailmap:["Trails of Tears en.png","Map: the routes of forced Native removal (the Trail of Tears)","🗺️"],
  douglass:["Frederick Douglass (circa 1879).jpg","Frederick Douglass (c. 1879)","📣"],
  stanton:["Elizabeth Cady Stanton.jpg","Elizabeth Cady Stanton, leader at Seneca Falls","♀️"],
  tubman:["Harriet Tubman c1868-69.jpg","Harriet Tubman (c. 1868)","🌟"],
  progress:["American Progress (John Gast painting).jpg","American Progress, John Gast (1872)","🌄"],
  acquisitions:["U.S. Territorial Acquisitions.png","Map: how the U.S. grew, one land grab at a time","🗺️"],
  cession:["Mexican Cession.png","Map: the Mexican Cession (1848)","🗺️"],
  uncletom:["UncleTomsCabinCover.jpg","Uncle Tom's Cabin, first edition (1852)","📕"],
  caning:["Southern Chivalry.jpg","“Southern Chivalry: Argument versus Club's,” John L. Magee (1856)","🦯"],
  dredscott:["Dred Scott photograph (circa 1857).jpg","Dred Scott (c. 1857)","⚖️"],
  election1860:["ElectoralCollege1860.svg","Map: the Election of 1860 by electoral votes","🗳️"],
  lincoln:["Abraham Lincoln O-77 matte collodion print.jpg","Abraham Lincoln, photographed by Alexander Gardner (1863)","🎩"],
  lee:["Robert Edward Lee.jpg","Confederate General Robert E. Lee","🎖️"],
  grant:["Ulysses S. Grant 1870-1880.jpg","Ulysses S. Grant, Union general and 18th president","🎖️"],
  gettysburg:["Thure de Thulstrup - L. Prang and Co. - Battle of Gettysburg - Restoration by Adam Cuerden.jpg","Battle of Gettysburg, Thure de Thulstrup (1887)","⚔️"],
  emancipation:["Emancipation proclamation.jpg","The Emancipation Proclamation (1863)","⛓️‍💥"],
  ajohnson:["Andrew Johnson photo portrait head and shoulders, c1870-1880-Edit1.jpg","Andrew Johnson, 17th president","🎩"],
  firstcolored:["First Colored Senator and Representatives.jpg","The first Black senator and representatives in Congress, Currier & Ives (1872)","🏛️"]
};
const imgURL = (k,w=800) => IMG[k] ? "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(IMG[k][0].replace(/ /g,"_")) + "?width=" + w : "";
const pageURL = k => "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(IMG[k][0].replace(/ /g,"_"));
function pic(k, opts={}){
  const meta = IMG[k] || [null, opts.cap || "", opts.emoji || "📜"];
  const cls = "ph" + (opts.zoom!==false && IMG[k] ? " zoom" : "") + (IMG[k] ? "" : " noimg") + (opts.cls ? " "+opts.cls : "");
  return `<figure class="${cls}" data-emoji="${opts.emoji || meta[2]}" data-alt="${esc(opts.alt || meta[1] || "")}" ${IMG[k]?`data-k="${k}"`:""} style="${opts.style||""}">`
    + (IMG[k] ? `<img src="${imgURL(k, opts.w||800)}" alt="${esc(meta[1])}" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.classList.add('noimg')">` : "")
    + (opts.cap!==false && meta[1] ? `<figcaption>${esc(opts.cap || meta[1])}</figcaption>` : "")
    + (opts.zoom!==false && IMG[k] && opts.badge!==false ? `<span class="zbadge">Enlarge</span>` : "")
    + `</figure>`;
}

/* picture for each story scene (same order as the story paragraphs); null = emoji tile */
const SCENES = {
  1:[["taos","🏜️"],["columbus","⛵"],["smallpox","🦠"],["cortes","⚔️"]],
  2:[[null,"🌿"],["mayflower","🚢"],["penn","🤝"],["slaveship","⛓️"],["whitefield","⛪"]],
  3:[["joinordie","🐍"],["massacre","💥"],["declaration","📜"],[null,"🧩"],["constitution","🏛️"]],
  4:[["lewisclark","🧭"],["tecumseh","🪶"],["missouri","🗺️"],["cottongin","⚙️"],["jackson","🎩"],["stanton","♀️"]],
  5:[["progress","🌄"],["uncletom","📕"],["dredscott","⚖️"],["gettysburg","⚔️"],["firstcolored","🏛️"]]
};
const HERO_IMG = {1:"columbus",2:"mayflower",3:"declaration",4:"lewisclark",5:"gettysburg"};

/* term → picture on the flash card */
const TERM_IMG = {
  "Cahokia":"cahokia","Pueblo":"taos","Christopher Columbus":"columbus","Hernán Cortés":"cortes","Bartolomé de Las Casas":"lascasas","Columbian Exchange":"smallpox",
  "Mayflower Compact":"compact","William Penn / Pennsylvania":"penn","Middle Passage":"slaveship","Great Awakening":"whitefield",
  "Albany Plan of Union":"joinordie","Boston Massacre":"massacre","Boston Tea Party":"teaparty","Common Sense":"commonsense","Declaration of Independence":"declaration","Yorktown":"cornwallis","Great Compromise":"constitution","Hamilton's Financial Plan":"hamilton","Washington's Farewell Address":"washington","Election of 1800":"jefferson",
  "Lewis and Clark":"lewisclark","Tecumseh":"tecumseh","Marbury v. Madison":"marshall","McCulloch v. Maryland":"marshall","Missouri Compromise":"missouri","Cotton gin":"cottongin","American System":"clay","Jacksonian Democracy":"jackson","Trail of Tears":"trailmap","Nullification Crisis":"calhoun","Frederick Douglass":"douglass","Seneca Falls Convention":"stanton",
  "Manifest Destiny":"progress","Treaty of Guadalupe Hidalgo":"cession","Uncle Tom's Cabin":"uncletom","Caning of Charles Sumner":"caning","Dred Scott v. Sandford":"dredscott","Election of 1860":"election1860","Gettysburg & Vicksburg":"gettysburg","Emancipation Proclamation":"emancipation","Johnson's impeachment":"ajohnson","15th Amendment":"firstcolored","Appomattox Court House":"grant"
};

/* Videos: [youtubeId, title, channel, note] */
const VIDEOS = {
  1:[["fTv4S1q7p_c","AP US History Unit 1 Review (1491–1607)","Heimler's History","The whole unit in one video"],
     ["TTYOQ05oDOI","The Natives and the English","Crash Course US History #3","Funny & fast"]],
  2:[["t0wIU4R0MhI","AP US History Unit 2 Review (1607–1754)","Heimler's History","The whole unit in one video"],
     ["o69TvQqyGdg","When is Thanksgiving? Colonizing America","Crash Course US History #2","Jamestown & the Pilgrims"],
     ["p47tZLJbdag","The Quakers, the Dutch, and the Ladies","Crash Course US History #4","Middle colonies & women"]],
  3:[["1oNumKYNUaE","AP US History Unit 3 Review (1754–1800)","Heimler's History","The whole unit, about 36 min"],
     ["1EMkWD0hr5E","The American Revolution (Topic 3.5)","Heimler's History","Short topic video"],
     ["eCoFYgZ0Pf0","Shaping a New Republic","Heimler's History","Articles → Constitution"]],
  4:[["kO5cfLxN44Y","AP US History Unit 4 Review (1800–1848)","Heimler's History","The whole unit, about 40 min"],
     ["XwPFSMxoD68","The Market Revolution, Explained","Heimler's History","About 10 min"],
     ["5ofOfZIZc5I","How Andrew Jackson Expanded Federal Power","Heimler's History","About 11 min"],
     ["_wf6-Ir55TI","An Age of Reform","Heimler's History","Reform movements"],
     ["beN4qE-e5O8","Age of Jackson","Crash Course US History #14","Funny & fast"]],
  5:[["JVrwXC0AnIk","AP US History Unit 5 Review playlist","Heimler's History","10 short videos, plays in order","PLEHRHjICEfDWmb7bduiSCHYnUmYx6r36N"],
     ["GzTrKccmj_I","The Civil War, Part 2","Crash Course US History #21","How the war was won"]]
};

/* Group chats: [speaker, text, side('me'|'') ] or ["sys", text] or ["fact", text]  */
const CHATS = {
  1:{title:"New World Debate 🌎",sub:"Las Casas, Sepúlveda, King Charles V",msgs:[
    ["King Charles V","Okay team, status update on the Americas? 👑"],
    ["Cortés","Aztec Empire: conquered ✅ Gold: shipped ✅ (smallpox did a lot of the work tbh 🦠)"],
    ["Las Casas","I need to talk about the encomienda system. Native people are being worked to death. This is wrong. 😤","me"],
    ["Sepúlveda","They're 'natural slaves.' Aristotle said some people are born to serve 📜"],
    ["Las Casas","Aristotle never set foot in the Americas, Juan. They have souls, cities, laws. They are fully human.","me"],
    ["King Charles V","Fine. Formal debate. Valladolid, 1550. Bring receipts."],
    ["sys","📍 Valladolid Debate, 1550"],
    ["fact","🧠 AP takeaway: Europeans debated how to treat Native peoples. Las Casas exposed the abuse, but tragically he also suggested using enslaved Africans instead, and the Atlantic slave trade grew."]]},
  2:{title:"Virginia Planters Club 🌿",sub:"Gov. Berkeley, Nathaniel Bacon, rich planters",msgs:[
    ["Planter","Tobacco prices are 🔥 but we need MORE workers"],
    ["Gov. Berkeley","Keep importing indentured servants. 4–7 years of work, then they're free. Easy."],
    ["Nathaniel Bacon","Yeah… about those 'free' ex-servants. They have no good land, no money, and they're furious. 😡","me"],
    ["Nathaniel Bacon","We want the frontier land. Berkeley won't fight the Natives because he's protecting his fur-trade buddies.","me"],
    ["sys","🔥 Bacon's Rebellion, 1676: Jamestown burned to the ground"],
    ["Planter","Okay that was terrifying. Poor white AND Black workers teamed up against us 😬"],
    ["Planter 2","What if our workers… never became free?"],
    ["fact","🛑 The dark turning point: after 1676, planters switched to enslaved Africans. Slavery became lifelong, inherited and based on race. This is a classic AP cause-and-effect question."]]},
  3:{title:"Sons of Liberty 🔔",sub:"Sam Adams, Ben Franklin, Parliament & 3 others",msgs:[
    ["Parliament","Hey colonies 👋 That French & Indian War was expensive. New Stamp Act! Every newspaper, legal doc & deck of cards needs a stamp 📜💸"],
    ["Sam Adams","we didn't vote for you 💀","me"],
    ["Parliament","You're 'virtually represented' 🙂"],
    ["John Dickinson","'virtually represented' = not represented."],
    ["Ben Franklin","[sends 🐍 Join, or Die cartoon] told y'all in 1754 we need to stick together"],
    ["Sam Adams","BOYCOTT. Nobody buys British goods. 🚫🇬🇧","me"],
    ["Parliament","Fine. Stamp Act repealed. BUT we can make laws for you 'in all cases whatsoever' 😏 (Declaratory Act)"],
    ["sys","📈 1767 Townshend Acts → 1770 Boston Massacre → 1773 Tea Party → 1774 Intolerable Acts"],
    ["Thomas Jefferson","Drafting something. Working title: 'Declaration of Independence.' 📝"],
    ["fact","🧠 AP takeaway: colonists didn't start out wanting independence. They wanted their rights as Englishmen. Each British crackdown pushed them further."]]},
  4:{title:"Washington D.C. 🏛️ (1832 edition)",sub:"Andrew Jackson, Henry Clay, John C. Calhoun, John Marshall",msgs:[
    ["Andrew Jackson","Just vetoed the Bank. It's a MONSTER 🐉 that helps the rich elites.","me"],
    ["Henry Clay","You can't just veto things because you don't like them, Andrew"],
    ["Andrew Jackson","watch me 😤","me"],
    ["John C. Calhoun","Also, South Carolina is nullifying your tariff. It doesn't apply to us. ✋"],
    ["Andrew Jackson","Try it and I'll send the army. Force Bill incoming. 🪖","me"],
    ["Henry Clay","Okay okay, everybody relax. Compromise Tariff of 1833 🤝"],
    ["John Marshall","Separate issue: Worcester v. Georgia. The Cherokee Nation is sovereign. Georgia's laws don't apply there. ⚖️"],
    ["sys","Andrew Jackson left John Marshall on read 👀"],
    ["fact","😔 Jackson ignored the Supreme Court. The Cherokee were forced west on the Trail of Tears (1838), and thousands died. AP loves asking how Jackson expanded presidential power."]]},
  5:{title:"The 1850s Were Chaos 🔥",sub:"Stephen Douglas, Lincoln, Frederick Douglass, South Carolina",msgs:[
    ["Stephen Douglas","New idea: let settlers in Kansas & Nebraska VOTE on slavery! Popular sovereignty 🗳️ Democracy!"],
    ["Lincoln","Stephen, that just erased the Missouri Compromise line.","me"],
    ["Kansas","🔥🔥 people are literally killing each other out here (Bleeding Kansas)"],
    ["Chief Justice Taney","Dred Scott decision: Black Americans aren't citizens, and Congress can't ban slavery in territories. Case closed. 🔨"],
    ["Frederick Douglass","This decision is outrageous. And it will only make the antislavery movement stronger."],
    ["South Carolina","If Lincoln wins in 1860, we're leaving. 👋"],
    ["Lincoln","Won. 🎉 (zero Southern electoral votes btw)","me"],
    ["sys","South Carolina left the group"],
    ["sys","10 more states left the group"],
    ["fact","🧠 AP takeaway: every 'compromise' over slavery in new land failed faster than the one before it. Westward expansion → the slavery fight → Civil War."]]}
};

/* Then vs. Now: relatable translations */
const THENNOW = {
  1:[["Columbian Exchange","The world's first global 'group chat merge': plants, animals and germs crossing an ocean that had separated people for 10,000+ years."],
     ["Smallpox in the Americas","Picture a pandemic where nobody has any immunity and there's no medicine. Some communities lost up to 90% of their people."],
     ["Encomienda","An 'internship' where you work forever, never get paid, and can't quit, while your boss claims he's 'protecting' you."],
     ["Native diversity","Like saying 'Europeans' are all the same. The Pueblo, Iroquois and Plains peoples were as different as Spain, Sweden and Russia."]],
  2:[["Indentured servitude","A company pays for your plane ticket, but you owe them 4–7 years of work to pay it back."],
     ["Salutary neglect","Parents who never check your screen time for 70 years, then suddenly lock your phone. Of course you're going to rebel."],
     ["Mercantilism / Navigation Acts","An app store that forces you to buy ONLY from them and takes a cut of everything."],
     ["Great Awakening","George Whitefield was basically a touring influencer, drawing crowds of thousands to emotional, viral revival 'shows.'"]],
  3:[["Stamp Act","Imagine paying a tax every time you post, text or print anything, set by a government you can't vote for."],
     ["Articles of Confederation","A group project with no leader where nobody can force anyone to do their part. Total chaos."],
     ["Checks & balances","Three people sharing a Netflix account where each one can block the others' worst choices."],
     ["Hamilton vs. Jefferson","Team 'Big City Bank' vs. Team 'Small Farm Freedom.' This is literally how the first political parties started."]],
  4:[["Market Revolution","The 1800s internet: canals, railroads and the telegraph made shipping and messaging 10× faster."],
     ["Spoils system","Winning class president, then giving every club position to your friends who voted for you."],
     ["Nullification","A student saying, 'That school rule doesn't apply to me.' Jackson: 'Yes it does.'"],
     ["Judicial review","A referee with instant replay who can overturn a play (law) that breaks the rulebook (Constitution)."]],
  5:[["Popular sovereignty","Letting each new server vote on its own rules, so people from outside flood in to swing the vote. Hello, Bleeding Kansas."],
     ["Fugitive Slave Act","Being legally forced to help with something you believe is deeply wrong. It turned neutral Northerners into abolitionists."],
     ["Sharecropping","A 'buy now, pay later' trap: borrow for seeds and tools, pay with your crop, and somehow always end up in debt."],
     ["Compromise of 1877","A backroom deal: 'You get the presidency, we get the troops out.' The people who paid were Black Southerners."]]
};

/* Primary sources to analyze (AP loves image stimulus questions) */
const SOURCES = {
  1:[["smallpox","Florentine Codex: smallpox","1570s, Aztec artists working with Spanish friar Bernardino de Sahagún",["Bodies covered in sores, people lying sick under blankets","Drawn by Native artists: this is THEIR point of view","Disease spread faster than the Spanish armies"],"Columbian Exchange questions: disease was the #1 cause of Native population collapse."],
     ["columbus","Landing of Columbus","John Vanderlyn, 1847 (painted for the U.S. Capitol)",["Columbus looks heroic and holy, holding a flag and a sword","The Taíno people hide in the background, small and fearful","Painted 350 years AFTER the event"],"Sourcing! Ask when it was made and why. This shows how 1800s Americans glorified exploration, not what really happened in 1492."],
     ["cahokia","Monks Mound, Cahokia","Built c. 900–1200 by Mississippian peoples",["A massive human-made earth platform","Cahokia may have had 10,000–20,000 people at its peak","Evidence of complex societies before Europeans"],"Debunks the myth that the Americas were 'empty wilderness' before 1492."]],
  2:[["slaveship","Plan of the slave ship Brookes","1788, published by British abolitionists",["Hundreds of people packed side by side like cargo","No room to sit up; this is the Middle Passage","Made to shock the public into opposing the slave trade"],"Purpose = persuasion. This became one of the most famous abolitionist images ever."],
     ["penn","Penn's Treaty with the Indians","Benjamin West, 1771–72",["William Penn trading fairly with the Lenape","Calm, peaceful, respectful mood","Painted about 90 years later, by a Pennsylvanian"],"Compare: Pennsylvania's peaceful Native relations vs. King Philip's War in New England."],
     ["salem","Salem witch trials","19th-century illustration of 1692",["An accused woman faces a crowd of accusers","Shows Puritan fear and religious intensity","About 20 people were executed"],"Shows tension and anxiety in Puritan New England society."],
     ["compact","The Mayflower Compact, 1620","Jean Leon Gerome Ferris, 1899",["Men signing an agreement on board the ship","A heroic, patriotic scene","Painted almost 300 years later"],"Mayflower Compact = early self-government. Remember to source the date of the painting!"]],
  3:[["joinordie","“Join, or Die.”","Benjamin Franklin, Pennsylvania Gazette, 1754",["A snake cut into pieces, each one a colony","Message: divided, we die; united, we survive","Made for the Albany Plan of Union during the French & Indian War"],"One of the most-tested images in AP US History. It was later reused against Britain during the Revolution!"],
     ["massacre","The Bloody Massacre in King Street","Paul Revere, 1770",["British soldiers shooting in a neat line on command","Colonists look innocent and unarmed","In reality it was a chaotic street brawl"],"PROPAGANDA. Revere's purpose was to make people angry at Britain. A classic 'purpose / point of view' question."],
     ["delaware","Washington Crossing the Delaware","Emanuel Leutze, 1851",["Washington standing heroically at the front of the boat","Night crossing on Dec. 25, 1776 before the surprise attack at Trenton","Historically inaccurate: wrong flag, wrong boat, and standing up would tip it over!"],"Shows how Americans in the 1850s mythologized the Revolution."],
     ["commonsense","Common Sense title page","Thomas Paine, January 1776",["'Written by an Englishman' (Paine had just arrived from England)","Plain language for ordinary readers","Sold over 100,000 copies in months"],"Shifted public opinion toward independence just months before July 1776."]],
  4:[["missouri","Missouri Compromise map","1820",["The line at 36°30' splits the Louisiana Territory","Missouri (slave) is an exception north of the line","Maine (free) balances it out"],"Map questions: be ready to explain how the compromise kept the Senate balanced."],
     ["trailmap","Routes of Indian Removal","1830s",["Five nations (Cherokee, Creek, Choctaw, Chickasaw, Seminole) forced west","Destination: 'Indian Territory' (modern Oklahoma)","Result of the Indian Removal Act (1830)"],"Connect it to Jackson, Worcester v. Georgia, and the Southern demand for cotton land."],
     ["cottongin","The cotton gin","Harper's Weekly, 1869",["Enslaved workers feeding cotton into the machine","One gin could clean about 50× more cotton per day","Made short-staple cotton hugely profitable"],"Technology → MORE slavery, not less. A favorite AP cause-and-effect question."]],
  5:[["progress","American Progress","John Gast, 1872",["A giant figure (Columbia) floats WEST, carrying a telegraph wire and a schoolbook","Railroads, farmers and settlers follow her; it's light behind her","Native Americans and buffalo flee into the darkness"],"THE Manifest Destiny image. It shows expansion as God-given 'progress' and ignores the cost to Native peoples."],
     ["caning","“Southern Chivalry: Argument versus Club's”","John L. Magee, 1856",["Rep. Preston Brooks beating Sen. Charles Sumner with a cane in the Senate","Sumner holds a pen; Brooks holds a club","Other senators watch and laugh"],"Made by a Northerner to show Southern violence. Sectional hatred was boiling over, and even Congress wasn't safe."],
     ["election1860","Election of 1860 map","Electoral votes by state",["Lincoln won every free state (North)","Not a single Southern state voted for him","4 candidates split the vote by region"],"Shows how sectional the country had become. The South saw Lincoln's win as a reason to secede."],
     ["firstcolored","First Black members of Congress","Currier & Ives, 1872",["Hiram Revels (first Black U.S. senator, 1870) and six representatives","Made possible by the 14th & 15th Amendments","This progress was rolled back after 1877"],"Reconstruction's achievements, and how fragile they were."]]
};

/* Who Am I? */
const WHO = [
  ["washington","George Washington","I led the Continental Army, became the first president, and warned you about political parties and foreign alliances on my way out.",3],
  ["hamilton","Alexander Hamilton","I wanted a national bank, wanted the government to take on state debts, and read the Constitution loosely.",3],
  ["jefferson","Thomas Jefferson","I wrote the Declaration of Independence, believed in strict construction… then bought Louisiana anyway.",3],
  ["paine","Thomas Paine","My pamphlet in plain English convinced ordinary colonists to want independence in 1776.",3],
  ["marshall","John Marshall","As Chief Justice, I gave the Supreme Court the power of judicial review and strengthened the federal government.",4],
  ["tecumseh","Tecumseh","I tried to unite Native nations against American expansion and allied with Britain in the War of 1812.",4],
  ["jackson","Andrew Jackson","Hero of New Orleans, champion of the 'common man,' killer of the national bank, and signer of the Indian Removal Act.",4],
  ["clay","Henry Clay","They call me 'the Great Compromiser.' I built the American System and helped with the Missouri Compromise and the Compromise of 1850.",4],
  ["calhoun","John C. Calhoun","I argued states could nullify federal laws, and I defended slavery as a 'positive good.'",4],
  ["douglass","Frederick Douglass","I escaped slavery, wrote a famous autobiography, and became the most powerful abolitionist speaker in America.",4],
  ["stanton","Elizabeth Cady Stanton","I helped organize the Seneca Falls Convention in 1848 and wrote the Declaration of Sentiments.",4],
  ["tubman","Harriet Tubman","I escaped slavery, then went back again and again on the Underground Railroad to lead others to freedom.",5],
  ["dredscott","Dred Scott","I sued for my freedom, and the Supreme Court said I wasn't even a citizen. The decision pushed the nation toward war.",5],
  ["lincoln","Abraham Lincoln","I opposed slavery's expansion, won in 1860, issued the Emancipation Proclamation, and was assassinated in 1865.",5],
  ["lee","Robert E. Lee","I commanded the Confederate army, lost at Gettysburg, and surrendered at Appomattox in 1865.",5],
  ["grant","Ulysses S. Grant","I won at Vicksburg, accepted the surrender at Appomattox, then became president during Reconstruction.",5],
  ["ajohnson","Andrew Johnson","I took over after Lincoln died, went easy on the South, fought with the Radical Republicans, and was impeached.",5],
  ["cortes","Hernán Cortés","I conquered the Aztec Empire between 1519 and 1521 with Native allies, and smallpox on my side.",1],
  ["lascasas","Bartolomé de Las Casas","I was a Spanish priest who exposed the brutal treatment of Native peoples and argued they were fully human.",1]
];

/* Extra image-stimulus quiz questions */
const IMG_QUIZ = {
  1:[{img:"smallpox",q:"This image, drawn by Aztec artists in the 1500s, best illustrates which development?",o:["The spread of maize cultivation","The impact of European diseases as part of the Columbian Exchange","The Spanish casta system","Native resistance in the Pueblo Revolt"],a:1,e:"The figures are covered in smallpox sores. Disease killed far more Natives than Spanish weapons did."}],
  2:[{img:"slaveship",q:"This 1788 diagram of the slave ship Brookes was most likely created to:",o:["Advertise the efficiency of the Atlantic trade","Persuade the public to oppose the slave trade","Help ship captains plan voyages","Celebrate British naval power"],a:1,e:"Abolitionists published it to shock people with the inhumanity of the Middle Passage."},
     {img:"penn",q:"This painting of William Penn best reflects which feature of colonial Pennsylvania?",o:["Strict Puritan religious rules","Relatively peaceful relations with Native Americans and religious tolerance","A plantation economy based on rice","Spanish mission culture"],a:1,e:"Quaker Pennsylvania bought land and kept peace with the Lenape, a contrast to wars in New England and Virginia."}],
  3:[{img:"joinordie",q:"Benjamin Franklin's 1754 cartoon was originally created to encourage:",o:["Colonial unity against France during the French and Indian War","Independence from Great Britain","Ratification of the Constitution","A boycott of British tea"],a:0,e:"It supported the Albany Plan of Union. It was REUSED later against Britain, but its original purpose was F&I War unity."},
     {img:"massacre",q:"Paul Revere's engraving of the Boston Massacre is best understood as:",o:["An accurate news photo of the event","Propaganda meant to stir anger against British troops","A British government poster","A celebration of British authority"],a:1,e:"It shows soldiers calmly firing on innocent colonists. It was designed to make people angry, not to be accurate."}],
  4:[{img:"missouri",q:"The line shown on this map (36°30') was created to:",o:["Divide Oregon with Britain","Separate free and slave territory in the Louisiana Purchase","Mark the border with Mexico","Show the route of the Erie Canal"],a:1,e:"The Missouri Compromise (1820): no slavery north of 36°30', except Missouri itself."},
     {img:"cottongin",q:"The invention shown in this image most directly led to:",o:["The decline of slavery in the South","The expansion of slavery and cotton production","The rise of Northern textile unions","The end of the Atlantic slave trade"],a:1,e:"The cotton gin made cotton super profitable, so slavery spread west with 'King Cotton.'"}],
  5:[{img:"progress",q:"John Gast's painting 'American Progress' (1872) best illustrates which idea?",o:["Popular sovereignty","Manifest Destiny","Nullification","Republican motherhood"],a:1,e:"Columbia leads settlers and technology west while Native Americans flee. That's Manifest Destiny."},
     {img:"caning",q:"This 1856 cartoon of Sen. Charles Sumner being beaten in the Senate best reflects:",o:["Growing cooperation between North and South","Rising sectional tension and violence over slavery","Support for the Compromise of 1850","Debate over the national bank"],a:1,e:"After Sumner's anti-slavery speech, Rep. Brooks beat him with a cane. The North was outraged; parts of the South cheered."},
     {img:"election1860",q:"The results shown on this 1860 election map most directly led to:",o:["The Compromise of 1850","The secession of Southern states","The Kansas-Nebraska Act","The Missouri Compromise"],a:1,e:"Lincoln won without a single Southern state, so South Carolina seceded in December 1860, followed by others."}]
};
UNITS.forEach(U=>{ (IMG_QUIZ[U.id]||[]).forEach(q=>U.quiz.push(q)); });

const PRESIDENTS = [
  ["George Washington","1789–97","None (Federalist-leaning)","Hamilton's plan, Whiskey Rebellion, Neutrality Proclamation, Jay's Treaty, Farewell Address"],
  ["John Adams","1797–1801","Federalist","XYZ Affair, Quasi-War, Alien & Sedition Acts"],
  ["Thomas Jefferson","1801–09","Dem-Republican","Louisiana Purchase, Lewis & Clark, Marbury v. Madison, Embargo Act"],
  ["James Madison","1809–17","Dem-Republican","War of 1812, Hartford Convention, Second Bank (1816)"],
  ["James Monroe","1817–25","Dem-Republican","Era of Good Feelings, Missouri Compromise, Monroe Doctrine"],
  ["John Quincy Adams","1825–29","Dem-Rep / Nat'l Rep","'Corrupt Bargain', Tariff of Abominations (1828)"],
  ["Andrew Jackson","1829–37","Democrat","Indian Removal, Bank War, Nullification Crisis, spoils system"],
  ["Martin Van Buren","1837–41","Democrat","Panic of 1837, Trail of Tears (1838)"],
  ["William H. Harrison","1841","Whig","Died after one month"],
  ["John Tyler","1841–45","Whig (sort of)","Texas annexation approved (1845)"],
  ["James K. Polk","1845–49","Democrat","Manifest Destiny, Oregon, Mexican-American War"],
  ["Zachary Taylor","1849–50","Whig","Mexican War hero; died in office"],
  ["Millard Fillmore","1850–53","Whig","Compromise of 1850, Fugitive Slave Act"],
  ["Franklin Pierce","1853–57","Democrat","Kansas-Nebraska Act, Gadsden Purchase, Ostend Manifesto"],
  ["James Buchanan","1857–61","Democrat","Dred Scott, John Brown's raid, secession begins"],
  ["Abraham Lincoln","1861–65","Republican","Civil War, Emancipation Proclamation, Gettysburg Address"],
  ["Andrew Johnson","1865–69","Democrat (Nat'l Union)","Presidential Reconstruction, Black Codes, impeached 1868"],
  ["Ulysses S. Grant","1869–77","Republican","15th Amendment, Enforcement Acts, scandals, Panic of 1873"],
  ["Rutherford B. Hayes","1877–81","Republican","Compromise of 1877, end of Reconstruction"]
];
const CASES = [
  ["Marbury v. Madison","1803","Judicial review","Court can strike down laws"],
  ["Fletcher v. Peck","1810","Contracts protected","Court can void state laws"],
  ["McCulloch v. Maryland","1819","Implied powers; states can't tax the national bank","Federal supremacy"],
  ["Dartmouth College v. Woodward","1819","State can't change a private charter","Protects business contracts"],
  ["Gibbons v. Ogden","1824","Congress controls interstate commerce","National economy"],
  ["Cherokee Nation v. Georgia","1831","Cherokee = 'domestic dependent nation'","Couldn't sue as a foreign nation"],
  ["Worcester v. Georgia","1832","Cherokee sovereign; GA law doesn't apply","Jackson ignored it → Trail of Tears"],
  ["Dred Scott v. Sandford","1857","Black people not citizens; Missouri Compromise unconstitutional","Pushed the nation toward war"]
];
const COMPROMISES = [
  ["Great Compromise","1787","Bicameral Congress (Senate equal, House by population)"],
  ["Three-Fifths Compromise","1787","Enslaved people = 3/5 for representation"],
  ["Missouri Compromise","1820","MO slave, ME free, 36°30' line"],
  ["Compromise Tariff","1833","Lowered tariffs to end the Nullification Crisis"],
  ["Compromise of 1850","1850","CA free, popular sovereignty, Fugitive Slave Act"],
  ["Kansas-Nebraska Act","1854","Popular sovereignty; killed the Missouri line (not a 'compromise' but often grouped)"],
  ["Compromise of 1877","1877","Hayes president, troops out → Reconstruction ends"]
];
const PARTIES = [
  ["1790s–1810s","Federalists (Hamilton, Adams) vs. Democratic-Republicans (Jefferson, Madison)"],
  ["1815–1824","Era of Good Feelings: basically one party (Dem-Republicans)"],
  ["1828–1854","Second Party System: Democrats (Jackson) vs. Whigs (Clay, Webster)"],
  ["1848–1854","Third parties: Free Soil (anti-slavery expansion), Know-Nothings (anti-immigrant)"],
  ["1854 →","Republicans (Lincoln, anti-slavery expansion) vs. Democrats (split N/S in 1860)"]
];


/* =========================================================
   PICTURES FOR EVENTS: every timeline event gets a painting,
   map or portrait. Keyword match first, then the unit's pool.
   ========================================================= */
const UNIT_POOL = {
  1:["cahokia","taos","columbus","smallpox","cortes","lascasas"],
  2:["mayflower","compact","penn","salem","whitefield","slaveship"],
  3:["joinordie","massacre","teaparty","commonsense","writingdecl","declaration","delaware","cornwallis","constitution","washington","hamilton","paine"],
  4:["jefferson","lewisclark","tecumseh","marshall","missouri","cottongin","clay","jackson","calhoun","trailmap","douglass","stanton"],
  5:["progress","acquisitions","cession","uncletom","caning","dredscott","election1860","lincoln","gettysburg","emancipation","grant","lee","ajohnson","firstcolored","tubman"]
};
const EVENT_KEYS = [
  [/cahokia|mississippian/i,"cahokia"],[/pueblo|po'?p[eé]/i,"taos"],[/columbus|reconquista/i,"columbus"],[/cort[eé]s|aztec/i,"cortes"],
  [/las casas|valladolid/i,"lascasas"],[/smallpox|columbian exchange|tordesillas/i,"smallpox"],
  [/mayflower|pilgrim|plymouth/i,"compact"],[/jamestown|virginia company/i,"mayflower"],[/penn(sylvania)?\b|quaker/i,"penn"],[/salem|witch/i,"salem"],
  [/awakening|whitefield|edwards/i,"whitefield"],[/stono|middle passage|africans arrive|slave code/i,"slaveship"],
  [/albany|french (and|&) indian/i,"joinordie"],[/boston massacre/i,"massacre"],[/\btea\b/i,"teaparty"],[/common sense/i,"commonsense"],
  [/declaration of independence|independence declared/i,"declaration"],[/trenton|delaware|saratoga/i,"delaware"],[/yorktown|cornwallis/i,"cornwallis"],
  [/seneca falls|stanton/i,"stanton"],[/constitution(al)? convention|constitution ratified|bill of rights|federalist/i,"constitution"],
  [/farewell|washington/i,"washington"],[/hamilton|first bank|whiskey/i,"hamilton"],[/louisiana|jefferson/i,"jefferson"],[/lewis/i,"lewisclark"],
  [/tecumseh|tippecanoe|war of 1812|1812/i,"tecumseh"],[/marbury|mcculloch|gibbons|marshall/i,"marshall"],[/missouri compromise/i,"missouri"],
  [/cotton gin|whitney/i,"cottongin"],[/\bclay\b|american system|corrupt bargain/i,"clay"],[/nullification|calhoun/i,"calhoun"],
  [/removal|trail of tears|cherokee|worcester/i,"trailmap"],[/jackson|tariff of abominations|bank war/i,"jackson"],
  [/douglass|liberator|garrison|abolition/i,"douglass"],[/tubman|underground railroad|fugitive slave/i,"tubman"],
  [/manifest destiny|texas|oregon/i,"progress"],[/gadsden|land/i,"acquisitions"],[/mexican|guadalupe|wilmot/i,"cession"],[/uncle tom/i,"uncletom"],
  [/sumner|bleeding kansas|kansas/i,"caning"],[/dred scott/i,"dredscott"],[/election of 1860|lincoln elected|secession|secede/i,"election1860"],
  [/emancipation/i,"emancipation"],[/gettysburg|vicksburg|antietam/i,"gettysburg"],[/fort sumter|\blee\b/i,"lee"],[/appomattox|\bgrant\b|surrender/i,"grant"],
  [/lincoln|homestead/i,"lincoln"],[/impeach|andrew johnson/i,"ajohnson"],[/reconstruction|13th|14th|15th|freedmen|compromise of 1877|black codes/i,"firstcolored"]
];
function eventPic(text, unit, used){
  used = used || new Set();
  for(const [re,k] of EVENT_KEYS){ if(re.test(text) && IMG[k] && !used.has(k)){ used.add(k); return k; } }
  const pool = (UNIT_POOL[unit] || []).filter(k=>IMG[k]);
  const fresh = pool.find(k=>!used.has(k));
  if(fresh){ used.add(fresh); return fresh; }
  for(const [re,k] of EVENT_KEYS){ if(re.test(text) && IMG[k]) return k; }
  return pool[(text.length) % (pool.length || 1)] || null;
}
