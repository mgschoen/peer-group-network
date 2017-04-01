var persons = {
	names: [
		"Axel",        // 0
		"Chris",       // 1
		"Cosmo",       // 2
		"Fabi",        // 3
		"Felix",       // 4
		"Franzi",      // 5
		"Kobel",       // 6
		"Maddin",      // 7
		"Mäxx",        // 8
		"Ossy",        // 9
		"Pim",         // 10
		"Schön"        // 11
	],
	faces: [
		"asset/axel.jpg",			// 0
		"asset/chris.jpg",		// 1
		"asset/cosmo.jpg",		// 2
		"asset/fabi.jpg",			// 3
		"asset/felix.jpg",		// 4
		"asset/franzi.jpg",		// 5
		"asset/kobel.jpg",		// 6
		"asset/maddin.jpg",		// 7
		"asset/maexx.jpg",		// 8
		"asset/ossy.jpg",			// 9
		"asset/pim.jpg",			// 10
		"asset/schoen.jpg"		// 11
	]
};

var relations = {
	phrases: [
		"",
		"...ist in einer Beziehung mit ",
		"...war in einer Beziehung mit ",
		"...ist in einem komplizierten Verhältnis mit ",
		"...war schon immer befreundet mit ",
		"...ist zur Grundschule gegangen mit ",
		"...ist auf eine weiterführende Schule gegangen mit ",
		"",
		"...(hat) studiert mit ",
		"...hat eine Ausbildung gemacht mit ",
		"...spielt in einer Band mit ",
		"...nimmt an Mittelalterlagern teil mit "
	],
	colors: [
		"#000000",    // 0: null
		"#8A0B14",    // 1: laufende Beziehung
		"#984447",    // 2: vergangene Beziehung
		"#CA907E",    // 3: kompliziertes Verhältnis
		"#365730",    // 4: alte Freundschaft
		"#1E152A",    // 5: Grundschule
		"#064E86",    // 6: Weiterführende Schule
		"#000000",    // 7: null
		"#82A7A6",    // 8: Studium
		"#0B5563",    // 9: Ausbildung
		"#CCA43B",    // 10: Band
		"#C73E1D"     // 11: Mittelalter
	],
	matrix: {
		y2015: [
			//             0             1             2             3             4             5             6             7             8             9             10            11
			/*  0 */      ["",           "",           "",           "",           "5",          "5",          "",           "",           "",           "",           "",           "4"],          // 0
			/*  1 */      ["",           "",           "",           "",           "",           "",           "6",          "6",          "",           "",           "",           ""],           // 1
			/*  2 */      ["",           "",           "",           "6,10",       "10",         "6",          "",           "",           "6,10",       "4,6",        "6,10",       "6,10"],       // 2
			/*  3 */      ["",           "",           "6,10",       "",           "10",         "6",          "4",          "4",          "6,10",       "6",          "6,10",       "6,10"],       // 3
			/*  4 */      ["5",          "",           "10",         "10",         "",           "4,5",        "11",         "11",         "4,10,11",    "",           "10",         "10"],         // 4
			/*  5 */      ["5",          "",           "6",          "6",          "4,5",        "",           "1",          "",           "6",          "6",          "6",          "6"],          // 5
			/*  6 */      ["",           "6",          "",           "4",          "11",         "1",          "",           "4,6,11",     "11",         "",           "",           ""],           // 6
			/*  7 */      ["",           "6",          "",           "4",          "11",         "",           "4,6,11",     "",           "11",         "",           "",           ""],           // 7
			/*  8 */      ["",           "",           "6,10",       "6,10",       "4,10,11",    "6",          "11",         "11",         "",           "6",          "6,10",       "4,5,6,10"],   // 8
			/*  9 */      ["",           "",           "4,6",        "6",          "",           "6",          "",           "",           "6",          "",           "5,6",        "6"],          // 9
			/* 10 */      ["",           "",           "6,10",       "6,10",       "10",         "6",          "",           "",           "6,10",       "5,6",        "",           "4,6,10"],     // 10
			/* 11 */      ["4",          "",           "6,10",       "6,10",       "10",         "6",          "",           "",           "4,5,6,10",   "6",          "4,6,10",     ""]            // 11
			//             0             1             2             3             4             5             6             7             8             9             10            11
		]
	}
};