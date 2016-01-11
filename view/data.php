<?php
    
    // Wort-Indizes definieren
    $iWord      = "word";
    $iLevel     = "level";
    $iTranslate = "translate";
    $iInfo      = "info";
    
    // Liste der Wörter
    $words = array(
        
        // Pinneken
        "pinneken"       => array(
            $iLevel      => "3",
            $iWord       => "Pinneken",
            $iTranslate  => "Schnapsglas",
            $iInfo       => "
                <b>Das Schnapsglas</b>: Ein genormtes Schnapsglas, Pinneken,
                Pinnchen oder auch Stamperl genannt, fasst in Deutschland
                2 cl (20 ml) oder 4 cl bei „doppelten“.
            "
        ),
        
        // Anne Ecke liegen
        "anneeckeliegen" => array(
            $iLevel      => "1",
            $iWord       => "Anne Ecke liegen",
            $iTranslate  => "Krank sein",
            $iInfo       => "
                <b>Krankheit</b> (mittelhochdeutsch krancheit, krankeit,
                synonym zu Schwäche, Leiden, Not) ist die Störung der Funktion
                eines Organs, der Psyche oder des gesamten Organismus.
            "
        ),
        
        // Bütterken
        "buetterken"     => array(
            $iLevel      => "2",
            $iWord       => "Bütterken",
            $iTranslate  => "Kleines Butterbrot",
            $iInfo       => "
                <b>Ein Butterbrot</b> ist eine mit Butter bestrichene Scheibe
                Brot. In Teilen Norddeutschlands bezeichnet das Wort Butterbrot
                eine belegte Scheibe Brot, wobei Butter nicht zum Belag gehören
                muss. Ein Hamburger Butterbrot ist die Bezeichnung für ein
                Schwarzbrot mit einem halben Brötchen.
            "
        ),
        
        // Dölmern
        "doelmern"       => array(
            $iLevel      => "1",
            $iWord       => "Dölmern",
            $iTranslate  => "Spielen",
            $iInfo       => "
                Zweckungebundenes (nicht sinnloses!), gedankenverlorenes
                <b>Vor-sich-hin-spielen</b> von Kindern, „rumdameln“.
            "
        ),
        
        // Dönekens
        "doenekens"      => array(
            $iLevel      => "2",
            $iWord       => "Dönekens",
            $iTranslate  => "Anekdoten",
            $iInfo       => "
                <b>Anekdoten</b>, heitere Kurzgeschichten, oft von
                zweifelhaftem Wahrheitsgehalt.
            "
        ),
        
        // Fickerig
        "fickerig"       => array(
            $iLevel      => "1",
            $iWord       => "Fickerig",
            $iTranslate  => "Nervös",
            $iInfo       => "
                <b>Nervös</b>, aufgeregt, zappelig — jemand, der nicht still
                halten kann.
            "
        ),
        
        // Latüchte
        "latuechte"      => array(
            $iLevel      => "1",
            $iWord       => "Latüchte",
            $iTranslate  => "Lampe",
            $iInfo       => "
                Die <b>„Latüchte“</b> ist ein eigentümlicher Vokabelmix aus der
                lateinischen „laterna“ und der plattdeutschen „Lüchte“,
                also quasi Römisches Platt bzw. plattdeutsches Latein.
                Verschiedene Lichtquellen können gemeint sein.
            "
        ),
        
        // Nönkern
        "noenkern"       => array(
            $iLevel      => "2",
            $iWord       => "Nönkern",
            $iTranslate  => "Mittagsschlag halten",
            $iInfo       => "
                Zeitlich ist <b>nönkern</b> recht eingegrenzt: Wie der Name
                schon sagt, <b>nönkert</b> man in der Mittagszeit, so zwischen
                12 und 15 Uhr. Denn <b>„nönkern“</b> kommt von „None“, und die
                None bezeichnet seit dem Mittelalter eine Gebetszeit im
                klösterlichen Tagesablauf, nämlich die neunte Stunde nach
                Anbruch des Tages.
            "
        ),
        
        // Plüdden
        "pluedden"       => array(
            $iLevel      => "1",
            $iWord       => "Plüdden",
            $iTranslate  => "Alte Klamotten",
            $iInfo       => "
                Alte, unmoderne, unordentliche Kleidung, <b>Klamotten</b>,
                Klamottenhaufen. Die ostwestfälische Ausdruck <b>„Plüdden“</b>
                (auch „Plünnten“ oder „Plünnen“) für Textilien stammt vom Wort
                „Plunder“, das schon im Mittelalter für gebrauchten Hausrat,
                Bettzeug und Kleidung verwendet wurde.
            "
        ),
        
        // Vermackeln
        "vermackeln"     => array(
            $iLevel      => "3",
            $iWord       => "Vermackeln",
            $iTranslate  => "Beschädigen",
            $iInfo       => "
                Etwas <b>beschädigen</b>, ankratzen, lädieren, ramponieren
                oder vertrimmen.
            "
        ),
        
        // Nöhlen
        "noehlen"        => array(
            $iLevel      => "1",
            $iWord       => "Nöhlen",
            $iTranslate  => "Meckern",
            $iInfo       => "
                <b>Meckern</b>, nörgeln, klagen — „Ihr seid auch nur am
                Nöhlen“, „Der geht einem mit seinem ständigen Genöhle ganz
                schön auf den Sack“.
            "
        ),
        
        // Angeschickert
        "angeschickert"  => array(
            $iLevel      => "2",
            $iWord       => "Angeschickert",
            $iTranslate  => "Angetrunken",
            $iInfo       => "
                <b>Angetrunken</b>, beschwipst, leicht betrunken — Ist man,
                nachdem die ersten „verkasematuckelten Pinneken“ oder
                „Pülleken“ ihre Wirkung entfalten.
            "
        ),
        
        // Beömmeln
        "beoemmeln"      => array(
            $iLevel      => "3",
            $iWord       => "Beömmeln",
            $iTranslate  => "Sich totlachen",
            $iInfo       => "
                Das tun sich die Leute dann, wenn jemand „son dummet Tüch
                labert“, dass sich die Balken vor <b>Lachen</b> biegen.
            "
        ),
        
        // Dittken
        "dittken"        => array(
            $iLevel      => "1",
            $iWord       => "Das läuft wie'n Dittken!",
            $iTranslate  => "Das läuft rund",
            $iInfo       => "
                <b>„Dittken“</b> bezeichnet ein 10-Pfennig-Stück. Weil man
                10-Pfennig-Stücke eigentlich immer nur wahrgenommen hat,
                wenn sie uns an der Kasse aus dem Portemonnaie fielen und über
                den Boden rollten, bekam das Dittken den Ruf des besonders
                bewegungsfreudigen Zahlungsmittels. Wenn eine Sache so glatt
                geht wie ein davonrollender Groschen, dann läuft sie also wie
                ein <b>Dittken</b>.
            "
        ),
        
        // Knüpp
        "knuepp"         => array(
            $iLevel      => "2",
            $iWord       => "Knüpp",
            $iTranslate  => "Knoten",
            $iInfo       => "
                Eine besonders schöne Wortsippe ist die Gruppe germanischer
                Wörter, die mit „kn“ anfangen. Ihnen ist gemein, dass sie
                etwas mit „zusammendrücken, pressen, klemmen, ballen“ zu tun
                haben (z.B. Knödel, Knospe, Knorpel, Knauf und Knopf). So auch
                der <b>Knoten</b>. Und weil man mit einem Knoten zwei Seilenden
                ver<b>knüp</b>fen kann, heißt der Knoten in Westfalen
                <b>„Knüpp“</b>.
            "
        )
    );

?>