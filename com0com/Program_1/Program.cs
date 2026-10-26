using System;
using System.IO.Ports;

public static class ComCommunication
{
    static string COM_name;
    static string nickname;
    static bool isOn = false;
    static SerialPort hh;


    public static void startCommunication(string com_name)
    {
        try {
            Console.ForegroundColor = ConsoleColor.DarkBlue;
            Console.WriteLine("Trying To Connect To " + com_name);
            COM_name = com_name;
            hh = new SerialPort(com_name);
            hh.Open();
            isOn = true;
            startListening();
        } catch
        {
            Console.WriteLine("Unable to connect to " + com_name);
        }
    }


    private static void startListening()
    {
        Console.ForegroundColor = ConsoleColor.White;
        Console.WriteLine("Starting listening on port " + COM_name);
        string m;
        nickname = hh.ReadLine();
        Console.WriteLine("New Connection With "+ nickname + " On Port " + COM_name);
        while (isOn)
        {
            m = hh.ReadLine();
            if (m.ToLower() == "exit")
            {
                endConnection();
            } else {
                Console.ForegroundColor = ConsoleColor.DarkGreen;

                Console.Write("New Messege from " + nickname +": ");
                Console.ForegroundColor = ConsoleColor.White;

                Console.Write(m + "\n");
            }
        }
    }

    private static void endConnection()
    {
        isOn = false;
        hh.Close();
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine("\nConnection ended with code 'exit'");
    }
}



public class program1
{
    public static void Main()
    {
        string name = "COM7";
        ComCommunication.startCommunication(name);
        Console.ForegroundColor = ConsoleColor.White;
    }
}