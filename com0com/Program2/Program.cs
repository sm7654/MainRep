using System;
using System.IO.Ports;

public static class ComCommunication
{
    static string COM_name;
    static bool isOn = false;
    static SerialPort hh;


    public static void startCommunication(string com_name, string nickname)
    {
        try {
            Console.ForegroundColor = ConsoleColor.DarkBlue;
            Console.WriteLine("Ttring To Connect To Port " + com_name);
            COM_name = com_name;
            hh = new SerialPort(com_name);
            hh.Open();
            isOn = true;
            hh.WriteLine(nickname);
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Connection Established");
            Console.ForegroundColor = ConsoleColor.White;
            sendmesssage();
            hh.Close();
        } catch
        {
            
        }
    }


    private static void sendmesssage()
    {
        string m;

        while (isOn)
        {
            Console.Write("Message: ");
            m = Console.ReadLine();
            hh.WriteLine(m);
            if (m.ToLower() == "exit")
            {
                endConnection();
            }
        }
    }

    private static void endConnection()
    {
        hh.Close();
        isOn = false;
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine("Connection closed with code 'exit'");
        Console.ForegroundColor = ConsoleColor.White;
    }
}



public class program2
{
    public static void Main()
    {
        Console.Write("Enter COM name: ");
        string portName = Console.ReadLine();
        Console.Write("Enter nickname: ");
        string nickname = Console.ReadLine();
        ComCommunication.startCommunication(portName, nickname);
    }
}